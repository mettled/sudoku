module.exports = function solveSudoku(matrix) {
  // your solution



  var main = new MainAlgoritm(matrix);

  if (main.isSolved())
      return main.takeArrayResult();
}

function MainAlgoritm(matrix){

  var solved = [];
  var steps = 0;

  initialisation(matrix);

  solve();

 function takeArrayResult (){
      var matrix = [];
      var q = 0;
      for(var i = 0 ; i < 9; i++){
          matrix[i] = [];
          for(var j = 0; j < 9; j++){
              q = solved[i][j][0];

              matrix[i][j] = q;
          }
      }
          return matrix;
  };



  this.takeArrayResult = function(){
      return takeArrayResult();
  };



 this.solved = function(){
      return solved;
  };

/*  Решаем судоку в цикле, если больше 20 циклов , прекращаем дальнейшее решений ..   */
  function solve() {




      var changed = 0;
      for (var i = 0; i< 81 ;i++){
          do {
              // сужаем множество значений для всех нерешенных чисел
              changed = updateSuggests(); // Если ничего нового не нашли .. выходим из цикла и больше решений этог судоку нету...


              steps++;
              if ( 81 < steps ) {
                  // Зашита от цикла
                  break;
              }
          } while (changed);
          OpenPairsCol(solved);
          OpenPairsRow(solved);
          HideCondidate(solved);

      }

      var solv = isSolved();
      var Fai = isFailed();

      if ( !solv & !Fai) {
          // используем поиск с возвратом
         backtracking();

      }
    //  if (solv )
      //    return '1';

  };


/* -------------- Метод поиска с возвратом --------------  */

function backtracking(next = false) {
    //  backtracking_call++;
      // Формируем новый массив
          var in_val = [[], [], [], [], [], [], [], [], []];
          var i_min=-1, j_min=-1, suggests_cnt=0;
          for ( var i=0; i<9; i++ ) {
              in_val[i].length = 9;
              for ( var j=0; j<9; j++ ) {
                  in_val[i][j] = solved[i][j][0];
                  if ( 'no-Ok' == solved[i][j][1] && (solved[i][j][2].length < suggests_cnt || !suggests_cnt) ) {
                      suggests_cnt = solved[i][j][2].length;
                      i_min = i;
                      j_min = j;
                  }
              }
          }

          // проходим по всем элементам, находим нерешенные,
          // выбираем кандидата и пытаемся решить
          for ( var k=0; k<suggests_cnt; k++ ) {
              in_val[i_min][j_min] = solved[i_min][j_min][2][k];
              // инициируем новый цикл
              var sudoku = new MainAlgoritm(in_val);

              //var ret = sudoku.solve();
              //alert(sudoku.solved) ;
              if ( sudoku.isSolved()) {
                  // нашли решение
                  var out_val = sudoku.solved();
                  // Записываем найденное решение
                  for ( var i=0; i<9; i++ ) {
                      for ( var j=0; j<9; j++ ) {
                          if ( 'no-Ok' == solved[i][j][1] ) {
                              markSolved(i, j, out_val[i][j][0])
                          }
                      }
                  }

                  return;

              } else if (sudoku.isFailed()){


                  continue;

              }
          }
  }



/*    function backtracking(next = false) {
    //  backtracking_call++;
      // Формируем новый массив
          var in_val = [[], [], [], [], [], [], [], [], []];
          var i_min=-1, j_min=-1, suggests_cnt=0;
          for ( var i=0; i<9; i++ ) {
              in_val[i].length = 9;
              for ( var j=0; j<9; j++ ) {
                  in_val[i][j] = solved[i][j][0];
                  if ( 'no-Ok' == solved[i][j][1] && (solved[i][j][2].length < suggests_cnt || !suggests_cnt) ) {
                      suggests_cnt = solved[i][j][2].length;
                      i_min = i;
                      j_min = j;
                  }
              }
          }

          // проходим по всем элементам, находим нерешенные,
          // выбираем кандидата и пытаемся решить
          for ( var k=0; k<suggests_cnt; k++ ) {
              in_val[i_min][j_min] = solved[i_min][j_min][2][k];
              // инициируем новый цикл
              var sudoku = new solveSudoku(in_val);
              if ( '1' ) {
                  // нашли решение
                  var out_val = solved;
                  // Записываем найденное решение
                  for ( var i=0; i<9; i++ ) {
                      for ( var j=0; j<9; j++ ) {
                          if ( 'no-Ok' == solved[i][j][1] ) {
                              markSolved(i, j, out_val[i][j][0])
                          }
                      }
                  }
                  return;
              }
          }
  }
*/
//---------------------------------------------------











/**
   * Проверка на найденное решение
   */
    function isSolved() {
      var is_solved = true;
      for ( var i=0; i<9; i++) {
          for ( var j=0; j<9; j++ ) {
              if ( 'no-Ok' == solved[i][j][1] ) {
                  is_solved = false;
              }
          }
      }
      return is_solved;
  }; // end of method isSolved()


  this.isSolved = function() {
      return isSolved();
  }; // end of public method isSolved()

/**
   * Есть ли ошибка в поиске решения
   *
   * Возвращает true, если хотя бы у одной из ненайденных ячеек
   * отсутствуют кандидаты
   */
   function isFailed() {
      var is_failed = false;
      for ( var i=0; i<9; i++) {
          for ( var j=0; j<9; j++ ) {
              if ( 'no-Ok' == solved[i][j][1] && !solved[i][j][2].length ) {
                  is_failed = true;
              }
          }
      }
      return is_failed;
  }; // end of method isFailed()


  this.isFailed = function(){
      return isFailed();
  }




  //-------------------------------------------------
  /*Проходим по ячейка судоку и анализируем их разными алгоритмами - Одиночка и Скрытый оиночка  */
      function updateSuggests() {
          var changed = 0;
          for ( var i=0; i<9; i++) {
              for ( var j=0; j<9; j++) {
                  if ( 'no-Ok' != solved[i][j][1] ) {
                      // Здесь решение либо найдено, либо задано
                      continue;
                  }

                  // "Одиночка"
                  changed += SingleDigital(i, j);

                  // "Скрытый одиночка"
                  changed += HiddSingleDigital(i, j);




              }
          }

          return changed;
      }
  //-------------------------------------------------

  /*инициализация, если есть число - помечаем данную позицию ОК и массив предположение пустой,
  если нету числа то ставим no-OK и задаем на начальном этапе все 9 цифр, каоторое могут быть на данной позиции*/

  function initialisation(matrix){
      var q;

      var Predpol = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for ( var i=0; i<9; i++) {

          solved[i] = [];
          //matrix[i] = [];
          for ( var j=0; j<9; j++ ) {
          // q =  matrix[i][j];
              if ( matrix[i][j] ) {
                  solved[i][j] = [matrix[i][j], 'ok', []];
              }
              else {
              solved[i][j] = [0, 'no-Ok', Predpol];
              }
          }
      }

  }
  //-------------------------------------------------
  /* Спионерил на хабре,  Хорошая функция для нахождения координат секции, лучше не придумаешь... */
      function sectOffset(i, j) {
          return {
              j: Math.floor(j/3)*3,
              i: Math.floor(i/3)*3
          };
      };

  //-------------------------------------------------
      /**
       * Отмечаем найденный элемент
       */
      function markSolved(i, j, solve) {
          solved[i][j][0] = solve;
          solved[i][j][1] = 'solved';
      }; // end of method markSolved()

  //-------------------------------------------------
  /*      Метод - Одиночка
  * последовательно прогоняем ячейку на ссответсвие по строкам
  * столбцам и по сектору, если в итоге остается только 1 число - оно является решением
  * записываем его в массив решений...
  */
      function SingleDigital(i, j) {
          solved[i][j][2] = arrayDiff(solved[i][j][2], crsToStribg(i,-1,''));
          solved[i][j][2] = arrayDiff(solved[i][j][2], crsToStribg(-1,j,''));
          solved[i][j][2] = arrayDiff(solved[i][j][2], crsToStribg(-1, -1,''+ i + j));

          if ( 1 == solved[i][j][2].length ) {    // если длина предположений = 1 значит мы нашли нужное число .. больше не ищем...
              // Исключили все варианты кроме одного
              markSolved(i, j, solved[i][j][2][0]);
              return 1;
          }
          return 0;
      }
  //-------------------------------------------------

  /*      Метод Скрытый одиночка
  Чуть сложнtе чем одиночка, но в итоге похоже.
  находим число которое одно единственное по строке, столбцу и сектору , оно то и является единственным решением для рассматриваемого места.
  */

      function HiddSingleDigital(i, j) {
          var less_suggest = HideSingleRow(i, j);
          var changed = false;
          if ( 1 == less_suggest.length ) {
              markSolved(i, j, less_suggest[0]);
              changed = true;
          }
          var less_suggest = HideSingleCol(i, j);
          if ( 1 == less_suggest.length ) {
              markSolved(i, j, less_suggest[0]);
              changed = true;
          }
          var less_suggest = HideSingleSect(i, j);
          if ( 1 == less_suggest.length ) {
              markSolved(i, j, less_suggest[0]);
              changed = true;
          }
          return changed;
      }

  //-------------------------------------------------

  /*      Метод Скрытый кандидат

  */
  function HideCondidate(matrix){
      var i = 0;
      var j = 0;
      var find = false;
      var str = '';
      var dif = [];
      var pos = [];
      var exc = '';
      var excol = '';
      //var offset = sectOffset(i,j);

      for (var q=0 ; q<9 ;q = q +3){
          for (var w=0 ; w<9 ; w = w+3){
              for (var k=1; k <= 9; k++){
                  pos.length = 0;
                  exc = '';
                  excol = '';
                  for (var i=0; i < 3; i++){
                      for (var j=0; j < 3; j++){
                      //  if (matrix[i+q][j+w][1] == 'no-Ok'){
                              var s = matrix[i+q][j+w][2].toString();
                              var foundPos = matrix[i+q][j+w][2].indexOf(k, 0);
                              if (foundPos > - 1){
                                  pos[pos.length] = +(i*3)+ +(j);
                                  exc =exc+ ''+(j+w);
                                  excol = excol +''+(i+q);
                              }


                      // }
                      }
                  }
                  s = pos.toString();
                  if (pos.toString() == "0,1" || pos.toString() == "0,2" || pos.toString() == "1,2" || pos.toString() == "0,1,2" ){

                      DelSomeDigital(q+0,0,''+k,exc);

                  } else if (pos.toString() == "3,4" || pos.toString() == "3,5" || pos.toString() == "4,5" || pos.toString() == "3,4,5" ){

                      DelSomeDigital(q+1,0,''+k,exc);

                  } else if (pos.toString() == "6,7" || pos.toString() == "6,8" || pos.toString() == "7,8" || pos.toString() == "6,7,8" ){

                      DelSomeDigital(q+2,0,''+k,exc);

                  }  else if (pos.toString() == "0,3" || pos.toString() == "3,6" || pos.toString() == "0,6" || pos.toString() == "0,3,6" ){

                      DelSomeDigital(w+0,1,''+k,excol);

                  } else if (pos.toString() == "1,4" || pos.toString() == "4,7" || pos.toString() == "1,7" || pos.toString() == "1,4,7" ){

                      DelSomeDigital(w+1,1,''+k,excol);

                  } else if (pos.toString() == "2,5" || pos.toString() == "5,8" || pos.toString() == "2,8" || pos.toString() == "2,5,8" ){

                      DelSomeDigital(w+2,1,''+k,excol);

                  }
              }
          }
      }

  }


//-------------------------------------------------

/*      Метод Открытые пары - column

*/

function OpenPairsCol(matrix) {
      var i = 0;
      var j = 0;
      var find = false;
      var dif = [];
      var less_suggesti = 0, less_suggestj = 0;
      for (var j =0; j<9 ; j++){
          find = false;
          less_suggestj = "";
          for(var i =0; i<9 ; i++){
              less_suggesti = matrix[i][j][2].toString();
              var lng = less_suggesti.length;
              if (less_suggesti.length == 3){

                  if (!less_suggestj.length){
                      less_suggestj = less_suggesti;
                  }else if (less_suggestj.length > 0 && less_suggestj == less_suggesti) {
                      find = true;
                      break;

                  } else{
                      continue;

                  }
              }
          }
          if (find) {

              DelSomeDigital(j,1,less_suggestj);

          }
      }
  }
  //-------------------------------------------------
  /*      Метод Открытые пары - row
  */

  function OpenPairsRow(matrix) {
          var i = 0;
          var j = 0;
          var find = false;

          var less_suggesti = 0, less_suggestj = 0;
          for (var j =0; j<9 ; j++){
              find = false;
              less_suggestj = "";
              for(var i =0; i<9 ; i++){
                  less_suggesti = matrix[j][i][2].toString();
                  var lng = less_suggesti.length;
                  if (less_suggesti.length == 3){

                      if (!less_suggestj.length){
                          less_suggestj = less_suggesti;
                      }else if (less_suggestj.length > 0 && less_suggestj == less_suggesti) {
                          find = true;
                          break;

                      } else{
                          continue;

                      }
                  }
              }
              if (find) {
                  DelSomeDigital(j,0,less_suggestj);
              }

          }


          //var changed = false;

          //return changed;

      }


  /* Удалить числа в строке или в столбце*/
  function DelSomeDigital(j,StrCol, delStr,exc = ''){

      var less_suggestj = delStr;
      var dif = [];

      if (StrCol == 0){

          for(var i = 0; i<9 ; i++){
              if ( solved[j][i][1] == 'no-Ok' && (less_suggestj != solved[j][i][2].toString() && ((exc.length>0 && exc.indexOf(''+i) == -1) || exc.length == 0)) && solved[j][i][2].length >0 ){
                  dif = [];

                  for (var l = 0; l< solved[j][i][2].length; l++)  {
                      for (var k = 0; k <= less_suggestj.length; k++){
                      if (solved[j][i][2][l] == +less_suggestj[k]){
                          break;

                      } else if (k == less_suggestj.length)
                          dif[dif.length] = solved[j][i][2][l];

                      }

                  }
                      if ( 1 == dif.length ) {
                          markSolved(j, i, dif[0]);
                      } else {
                          solved[j][i][2] = dif;
                      }
                  }

              }

      }
      else {
          for(var i = 0; i<9 ; i++){
              if ( solved[i][j][1] == 'no-Ok' && (less_suggestj != solved[i][j][2].toString() && ((exc.length>0 && exc.indexOf(''+i) == -1) || exc.length == 0)) && solved[i][j][2].length >0 ){
                  dif = [];

                  for (var l = 0; l< solved[i][j][2].length; l++)  {
                      for (var k = 0; k <= less_suggestj.length; k++){
                      if (solved[i][j][2][l] == +less_suggestj[k]){
                          break;

                      } else if (k == less_suggestj.length)
                          dif[dif.length] = solved[i][j][2][l];

                      }

                  }
                      if ( 1 == dif.length ) {
                          markSolved(i, j, dif[0]);
                      } else {
                          solved[i][j][2] = dif;
                      }
              }

          }
      }

  }

  //-------------------------------------------------

  /*      преобразовываем строку, столбец или сектор в массив чисел*/
  function crsToStribg(str,col,koord){ // массив в строку
      var offset = sectOffset(+koord[0],+koord[1]);
      var ms = [];
      var l;
      if (str > -1){

          for (var i=0; i < 9; i++){
              if ('no-Ok' != solved[str][i][1]){
                  l = ms.length;
                  ms[l] = solved[str][i][0];
              }
          }

      } else if (col > -1){

          for (var i=0; i < 9; i++){
              if ('no-Ok' != solved[i][col][1])
                  ms[ms.length] = solved[i][col][0];
          }

      } else if (col == -1 && str == -1 && koord.length > 0 ){

          for (var i=0; i < 3; i++){
              for (var j=0; j < 3; j++){

                  if ('no-Ok' != solved[offset.i+i][offset.j+j][1] ){
                      ms[ms.length] = solved[offset.i+i][offset.j+j][0];

                  }
              }
          }

      } else
          ms = [];

  return ms;
  }
  //-------------------------------------------------
  /*      нахождение массива отличий-----*/
      function arrayDiff (matrix1, matrix2) {
          var matrixDiff = [];
          for ( var i=0; i<matrix1.length; i++ ) {

              var is_found = false;
              for ( var j=0; j<matrix2.length; j++ ) {
                  if ( matrix1[i] == matrix2[j] ) {
                      is_found = true;
                      break;
                  }
              }
              if ( !is_found ) {
                  matrixDiff[matrixDiff.length] = matrix1[i];
              }
          }
          return matrixDiff;
      };
//---------------------------------------------------
/* Просматриваем строку и анализируем есть ли в этой ячейке скрытые одиночки
  *обязательно убраем из анализа начальную ячейку, ибо там нету отличий
   */
   function HideSingleRow(i, j) {
      var less_suggest = solved[i][j][2];
      var qw;
      for ( var k=0; k<9; k++ ) {
          qw = solved[i][k][1];
          if ( k == j ||'no-Ok' != solved[i][k][1] ) {
              continue;
          }
          less_suggest = arrayDiff(less_suggest, solved[i][k][2]);
      }
      return less_suggest;
  };

//---------------------------------------------------

 /**Просматриваем столбец и анализируем есть ли в этой ячейке скрытые одиночки
  * обязательно убраем из анализа начальную ячейку, ибо там нету отличий
   */
   function HideSingleCol(i, j) {
      var less_suggest = solved[i][j][2];
      for ( var k=0; k<9; k++ ) {
          if ( k == i ||'no-Ok' != solved[k][j][1] ) {
              continue;
          }
          less_suggest = arrayDiff(less_suggest, solved[k][j][2]);
      }
      return less_suggest;
  };
//---------------------------------------------------
/**Просматриваем секцию и анализируем есть ли в этой ячейке скрытые одиночки
 * обязательно убраем из анализа начальную ячейку, ибо там нету отличий
 *
 *                 if ('no-Ok' != solved[+koord[0]+i][+koord[1]+j][1]){
                  ms[ms.length] = solved[+koord[0]+i][+koord[1]+j][0];
 *
 *
   */
   function HideSingleSect(i, j) {
      var offset = sectOffset(i,j);
      var less_suggest = solved[i][j][2];
      var offset = sectOffset(i, j);
      for ( var k=0; k<3; k++ ) {
          for ( var l=0; l<3; l++ ) {
              if ( ((offset.i+k) == i  && (offset.j+l) == j) || 'no-Ok' != solved[offset.i+k][offset.j+l][1])  {
                  continue;
              }
              less_suggest = arrayDiff(less_suggest, solved[offset.i+k][offset.j+l][2]);
          }
      }
      return less_suggest;
  };
//---------------------------------------------------

}
