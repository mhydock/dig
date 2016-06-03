$(function() {
    var game = new Game();
    
    log("Game has begun");
    
    var $window = $(window);
    var wrapper = $('#wrapper');
    var tooltip = $('#tooltip');
    var gameScreen = $('#gameScreen');
    var progCursor = $('#progCursor');    
    
    var moneyDiv = $('#money');
    var mainContent = $('#inventory > .content');
    var subContent = $('#econList > .content');
    
    var toolsTab = $('#tools');
    var itemsTab = $('#items');
    var econTab = $('#econ');
    var techTab = $('#tech');
    var busiTab = $('#busi');

    var toolBoxList = $('#toolsList');
    var itemBoxList = $('#itemsList');
    var econBoxList = $('#econList');
    var techBoxList = $('#techList');
    var busiBoxList = $('#busiList');
    
    function updateMoney(money) {
        moneyDiv.text('$ ' + money);
    }
    
    function updateHover(event) {
        var x = event.pageX - this.offsetLeft;
        var y = event.pageY - this.offsetTop;
        
        var w = gameScreen.width();
        var h = gameScreen.height();
        
        var hoverText = game.getHoverText(x, y);
        if (hoverText === null)
        {
            tooltip.hide();
            return;
        }
        
        tooltip.html(game.getHoverText(x, y));
        tooltip.css({'top': (event.pageY+2)+'px', 'left': (event.pageX+2)+'px'});
        tooltip.show();
    }
        
    function buildToolBox(tool) {
        var toolBox = $('<div>');
        var title = $('<h3>').text(tool.getName());
        var amountLbl = $('<label>');
        var buyCostLbl = $('<label>');   
        var buyBtn = $('<button>Buy</button>').click(function () {
            var cost = tool.tryBuy(game.getMoney());
            if (cost >= 0)
                game.subMoney(cost);
            else
                alert('You do not have enough money to buy a ' + tool.getName());
        });
        var sellBtn = $('<button>Sell</button>').click(function () {            
            var sale = tool.trySell();
            if (sale >= 0)
                game.addMoney(sale);
            else
                alert('You cannot sell that tool');
        });
        
        function checkCost(cost) {
            buyCostLbl.text('Next: $ ' + cost);
            if (cost > game.getMoney())
                buyBtn[0].disabled = true;
        }
        
        function checkMoney(money) {
            if (money < tool.getBuyCost())
                buyBtn[0].disabled = true;
            else
                buyBtn[0].disabled = false;
        }
        
        function checkAmount(amount) {
            sellBtn[0].disabled = amount <= 0;
            amountLbl.text('x ' + withSuffix(amount));
            if (amount > 1000)  amountLbl[0].title = amount;
            else                amountLbl[0].title = '';
        }
        
        function checkResearched(level) {
            if (level >= tool.getMinTechLevel() || tool.isKnown())
                toolBox.css({'display': 'block'});
            else
                toolBox.css({'display': 'none'});
        }
        
        checkCost(tool.getBuyCost());
        checkAmount(tool.getAmount());
        
        tool.addCostListener(checkCost);
        tool.addAmountListener(checkAmount);

        checkMoney(game.getMoney());
        game.addMoneyListener(checkMoney);
        
        var tech = tool.getTechnology();
        checkResearched(tech.getLevel());
        tech.addLevelListener(checkResearched);
            
        toolBox.append(title)
               .append(amountLbl)
               .append(buyCostLbl)
               .append(buyBtn)
               .append(sellBtn);
        toolBoxList.append(toolBox);
    }
    
    function buildItemBox(item) {
        var itemBox = $('<div>');
        var title = $('<h4>').text(item.getName());
        var amountLbl = $('<label>').text('x ' + item.getAmount());
        var valueLbl = $('<label>').text('$ ' + item.getValue() + ' per');
        var sellBtn = $('<button>Sell</button>').click(function() {
            var sale = item.trySell();
            if (sale >= 0)
                game.addMoney(sale);
            else
                alert('You cannot sell that item');
        });
        var sell100Btn = $('<button>Sell x100</button>').click(function() {
            var sale = item.trySellMany(100);
            if (sale >= 0)
                game.addMoney(sale);
            else
                alert('You cannot sell 100 of that item');
        });
        var sellAllBtn =$('<button>Sell All</button>').click(function() {
            var sale = item.trySellAll();
            if (sale >= 0)
                game.addMoney(sale);
            else
                alert('You cannot sell those items');
        });
        
        itemBox[0].title = item.getDescription();
        
        function checkAmount(amount) {
            sellBtn[0].disabled = amount <= 0;
            sell100Btn[0].disabled = amount < 100;
            
            if (amount < 100)   sell100Btn.hide();
            else                sell100Btn.show();
            
            if (amount < 1000)  sellAllBtn.hide();
            else                sellAllBtn.show();
            
            amountLbl.text('x ' + withSuffix(amount));
            if (amount > 1000)  amountLbl[0].title = amount;
            else                amountLbl[0].title = '';
        }
        
        function checkKnown(known) {
            if (known)
                itemBox.css({'display': 'block'});
            else
                itemBox.css({'display': 'none'});
        }
        
        checkKnown(item.isKnown());
        checkAmount(item.getAmount());
        
        item.addKnownListener(checkKnown);
        item.addAmountListener(checkAmount);
             
        itemBox.append(title)
               .append(amountLbl)
               .append(valueLbl)
               .append(sellBtn)
               .append(sell100Btn)
               .append(sellAllBtn);
        itemBoxList.append(itemBox);
    }
    
    function buildTechBox(tech) {
        var techBox = $('<div>');
        var title = $('<h3>').text(tech.getName());
        var levelLbl = $('<label>');
        var resCostLbl = $('<label>');   
        var researchBtn = $('<button>Research</button>').click(function () {
            var cost = tech.tryResearch(game.getMoney());
            if (cost >= 0)
                game.subMoney(cost);
            else
                alert('You do not have enough money to research ' + tech.getName());
        });
        
        function checkCost(cost) {
            resCostLbl.text('Next: $ ' + cost);
            if (cost > game.getMoney())
                researchBtn[0].disabled = true;
        }
        
        function checkMoney(money) {
            if (money < tech.getResearchCost())
                researchBtn[0].disabled = true;
            else
                researchBtn[0].disabled = false;
        }
        
        function checkLevel(level) {
            levelLbl.text('Level: ' + level);
        }
        
        function checkVisibility(visible) {
            if (visible)
                techBox.show();
            else
                techBox.hide();
        }
        
        checkCost(tech.getResearchCost());
        checkLevel(tech.getLevel());
        checkVisibility(tech.getVisibility());
        
        tech.addCostListener(checkCost);
        tech.addLevelListener(checkLevel);
        tech.addVisibilityListener(checkVisibility);
            
        checkMoney(game.getMoney());
        game.addMoneyListener(checkMoney);
        
        techBox.append(title)
               .append(levelLbl)
               .append(resCostLbl)
               .append(researchBtn);
        techBoxList.append(techBox);
    }
    
    var tools = game.getToolsInventory().getTools();
    for (var t in tools)
    {
        buildToolBox(tools[t]);
    }
    
    var items = game.getItemsInventory().getItems();
    for (var i in items)
    {
        buildItemBox(items[i]);
    }
    
    var techs = game.getTechnologyTree().getTechnologies();
    for (var h in techs)
    {
        buildTechBox(techs[h]);
    }
    
    function changeTab(tab, list) {
        var parent = tab.parent().parent();
        
        var select = parent.children('.tabs').find('li.selected').first();
        if (select === tab)
            return;
        
        var content = parent.children('.content').first();
        content.children().hide();
        list.show();
        
        select.removeClass('selected');
        tab.addClass('selected');
    }
    
    toolsTab.click(function() {
        changeTab(toolsTab, toolBoxList);
    });
    
    itemsTab.click(function() {
        changeTab(itemsTab, itemBoxList);
    });
    
    econTab.click(function() {
        changeTab(econTab, econBoxList);
    });
    
    techTab.click(function() {
        changeTab(techTab, techBoxList);
    });
    
    busiTab.click(function() {
        changeTab(busiTab, busiBoxList);
    });
    
    wrapper.css({'height': $window.height() + 'px'});
   
    game.setFontSize(gameScreen.css('font-size'));
    game.setViewHeight(gameScreen.height());
    
    $window.resize(function () {
        wrapper.css({'height': $window.height() + 'px'});
        game.setViewHeight(gameScreen.height());
    });
    
    gameScreen.html(game.printVisibleGrid());

    updateMoney(game.getMoney());
    game.addMoneyListener(updateMoney);
    gameScreen.mousemove(updateHover);
    gameScreen.mouseleave(function() {tooltip.hide();});

    techTab.click();
    toolsTab.click();
    
    // keycodes found here http://www.javascriptkeycode.com/
    $(document).keydown(function(event) {
        if (event.which == 37)          // left arrow
            game.moveLeft();
        if (event.which == 38)          // up arrow
            game.moveUp();
        if (event.which == 39)          // right arrow
            game.moveRight();
        if (event.which == 40)          // down arrow
            game.moveDown();

        gameScreen.html(game.printVisibleGrid()); 
        progCursor.css({'top': game.getProgress() + '%'});        
    });
});