

// budget container

var budgetController = (function () {


     var Expense = function(id,description,value){

          this.id = id;
          this.description = description;
          this.value = value;

     }


     var Income = function(id,description,value){

          this.id = id;
          this.description = description;
          this.value = value;

     }

      
     var data = {

           allItems: {

            exp: [],
            inc: []
           },
           totals: {

            exp: 0,
            inc: 0
           },
           budget: 0,
           percentage: -1

     };


    var calculateTotal = function(type) {

       var sum=0;
       data.allItems[type].forEach(function(cur){
        sum += cur.value;
       });
      data.totals[type] = sum;

    };



    return  {

      addItems: function(type,des,val){
          var newItem,ID;

          // create new id
          if(data.allItems[type].length >0)
            ID = data.allItems[type][data.allItems[type].length - 1].id +1;
          else 
            ID = 0;
          
         //create new item based on inc and exp

         if(type === 'exp')
          newItem = new Expense(ID,des,val);
        else if(type === 'inc')
          newItem = new Income(ID,des,val);
           
         // pushing the item into data structure  
         data.allItems[type].push(newItem);

         //return new item

         return newItem;
      },
    
     calculateBudget: function(){

         // calculate total income and total expenses
            calculateTotal('exp');
            calculateTotal('inc');
         // calculate the total budget 
            data.budget = data.totals.inc - data.totals.exp;
         // calculate the expense percentage

         if(data.totals.inc >0)
            data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
         else
            data.percentage = -1; 
     },
   
      getBudget: function(){

        return{

             budget: data.budget,
             totalinc: data.totals.inc,
             totalexp: data.totals.exp,
             percentage: data.percentage

        }
      },



    testing: function() {

      console.log(data)
    }

   };

})();








// UI controller changes

var UIController = (function (){

    
     var DomStrings = {

         inputType: '.add__type',
         inputDescription: '.add__description',
         inputValue: '.add__value',
         inputBtn: '.add__btn',
         incomeContainer: '.income__list',
         expenseContainer: '.expenses__list',
         budgetLevel: '.budget__value',
         incomeLevel: '.budget__income--value',
         expenseLevel: '.budget__expenses--value',
         percentageLevel: '.budget__expenses--percentage',
         container: '.container'

     };

     return {
     	
           getInput: function() {

             return {

                type: document.querySelector(DomStrings.inputType).value, // for + inc And for - exp
                description: document.querySelector(DomStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DomStrings.inputValue).value)
             };

           },

           addListItem: function(obj,type){

               var html,newHtml,element;
               //create html string with placeholder text
               if(type === 'inc')  
              {
               element = DomStrings.incomeContainer;  
               html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
               }
               else if(type === 'exp')
              {
               element = DomStrings.expenseContainer;
               html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
               }
              // replace placeholder text with actual data
               newHtml = html.replace('%id%', obj.id);
               newHtml = newHtml.replace('%description%', obj.description);
               newHtml = newHtml.replace('%value%', obj.value);
              // insert the html into DOM
               
               document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);        
           },
           

           clearFields: function() {
              var fields,fieldsArr;

           fields = document.querySelectorAll(DomStrings.inputDescription+', '+DomStrings.inputValue);

           fieldsArr = Array.prototype.slice.call(fields);
           fieldsArr.forEach(function(current,index,array){

                current.value = "";               

           });
           },

           displayBudget: function(obj){

            document.querySelector(DomStrings.budgetLevel).textContent = obj.budget;
            document.querySelector(DomStrings.incomeLevel).textContent = obj.totalinc;
            document.querySelector(DomStrings.expenseLevel).textContent = obj.totalexp;

            if(obj.percentage >0)
               document.querySelector(DomStrings.percentageLevel).textContent = obj.percentage;
            else
               document.querySelector(DomStrings.percentageLevel).textContent = '---';
           },

           getDomStrings: function() {

             return  DomStrings;

           }

     };



})();








// controller

var controller = ( function(budgetctrl, UIctrl) {


   // setup event listeners function
    var setupEventListeners = function (){

       var Dom = UIctrl.getDomStrings();
       document.querySelector(Dom.inputBtn).addEventListener('click', ctrlAddItem);
       document.addEventListener('keypress', function(event){

      if(event.keyCode === 13 || event.which === 13)
      {
        ctrlAddItem();
         }
  
     });

       document,querySelector(DomStrings.container).addEventListener('click',ctrDeleteItem);
   };
  

   // updating budget data

    var updateBudget = function() {
     
        // calculate the budget
          budgetctrl.calculateBudget();
        // return the budget
          var budget = budgetctrl.getBudget()
        //display the budget on the budget field 
          UIctrl.displayBudget(budget);
    };

    // add new item function 

    var ctrlAddItem = function() {
     
          var input,newItem;

          // get field input
           input = UIctrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value>0)
        {
          // Add item to the budget  controller
           newItem = budgetctrl.addItems(input.type,input.description,input.value);

          // add item to the ui controller
           UIctrl.addListItem(newItem, input.type);

           UIctrl.clearFields();

          // budget
          updateBudget();
        }
    };
      
     var ctrDeleteItem = function(event){

          var itemId,splitId,type,id;

          itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

          if(itemId){

             //inc-1

             splitId = itemId.split('-');
             type = splitId[0];
             id = splitId[1];

          }

          // delete item from the data structure


          // delete the item from the UI


          // Update and show the new budget

     };



    return {
    	init: function() {
    		 console.log('application started');
         UIctrl.displayBudget({

             budget: 0,
             totalinc: 0,
             totalexp: 0,
             percentage: -1

        });
    		 setupEventListeners();
    	}
    }; 


}) (budgetController,UIController);


controller.init();

