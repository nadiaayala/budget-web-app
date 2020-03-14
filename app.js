//Model
var budgetController = (function(){
    var Expense = function(id,description, value){
        this.description = description;
        this.value = parseInt(value);
        this.id = id;
    }

    var Income = function(id,description, value){
        this.description = description;
        this.value = parseInt(value);
        this.id = id;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        }, 
        totals: {
            exp: 0,
            inc: 0,
        },

        budget: 0
    }
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        if(type === 'exp'){
            data.totals[type] = sum * -1;
        }
        else if(type === 'inc'){
            data.totals[type] = sum;
        }
        return data.totals[type];
    }

    return {
        addItem: function(type, description, val){
            var newItem, ID;
            //Create new id
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            //Create new item 
            if (type == 'exp'){
                newItem = new Expense(id, description, val);
            }
            else if (type == 'inc') {
                newItem = new Income(id, description, val);
            }
            data.allItems[type].push(newItem);
        },

        returnData: function(){
            return data;
        }, 

        calcBudget: function(){
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget = data.totals.inc - data.totals.exp;
            // return data.budget;
        },
        // calcIncomes: function(type){
        //     return calculateTotal('inc');
        // },
        // calcExpenses: function(){
        //     return calculateTotal('exp');
        // }
    }
})();

//View
var UIController = (function(){
    var DOMitems = {
        inputType: document.querySelector('.add__type'),
        inputDesc: document.querySelector('.add__description'),
        inputVal: document.querySelector('.add__value'),
        expensesContainer: '.expenses',
        incomesContainer: '.income',
        budget: document.querySelector('.budget__value'),
        totalInc: document.querySelector('.budget__income--value'),
        totalExp: document.querySelector('.budget__expenses--value'),
        dateLabel: document.querySelector('.budget__title--month')
    }

    var formatNumber = function(num, type){
        var  numSplit, int, dec, type;
        num = Math.abs(num);
        num = num.toFixed(2);
        
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }
        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + int + '.' + dec;
    }
    
    return{
        getInputs: function(){
            return {
                type: DOMitems.inputType.value,
                desc: DOMitems.inputDesc.value,
                val: DOMitems.inputVal.value
            }
        },
 //When this function is called, obj.id is undefined!
        addItemUI: function(obj, type){
            var html, newHtml, element;
            if(type==='inc'){
                element = DOMitems.incomesContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%Description%</div> <div class="right clearfix"> <div class="item__value">%Value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
             }
             else if (type==='exp'){
                 element = DOMitems.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%Description%</div> <div class="right clearfix"> <div class="item__value">%Value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
             }
             newHtml = html.replace('%id%', obj.id);
             console.log(obj.id);
             newHtml = newHtml.replace('%Description%',  obj.desc);
             newHtml = newHtml.replace('%Value%', formatNumber(obj.val, type));

             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        }, 

        clearInputs: function(){
            DOMitems.inputDesc.value = '';
            DOMitems.inputVal.value = '';
            this.focusFirstInput();
        },
        focusFirstInput: function(){
            DOMitems.inputDesc.focus();
        },
        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            DOMitems.totalInc.textContent =  formatNumber(obj.totals.inc, 'inc');
            console.log(obj.totals.inc);
            DOMitems.totalExp.textContent = formatNumber(obj.totals.exp, 'exp');
            DOMitems.budget.textContent = formatNumber(obj.budget, type);
        },
        getMonth: function() {
            var date, month, year;
            date = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = date.getMonth();
            year = date.getFullYear();
            DOMitems.dateLabel.textContent = months[month] + ' ' + year;
            
        }
    }

})();

//Controller
var controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function(){
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 ||  event.which === 13){
                console.log(' Enter was pressed.');
                ctrlAddItem();
            }
        });
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    }

    var ctrlAddItem = function(){
        //1. Get the field input data
        let item = UICtrl.getInputs();

        //2.Add the item to the budget controller
        budgetCtrl.addItem(item.type, item.desc, parseFloat(item.val));
        console.log(item);
        budgetCtrl.calcBudget();

        //3.Add the item to the UI
        UICtrl.addItemUI(item, item.type);
        UICtrl.clearInputs();
        UICtrl.displayBudget(budgetCtrl.returnData());
        //4. Calculate the budget

        //5.Display the budget on the UI

    };
    
    return{
        init: function(){
            setupEventListeners();
            UICtrl.focusFirstInput();
            UICtrl.getMonth();
        }
    }
    

        
    })(budgetController, UIController);



controller.init();

