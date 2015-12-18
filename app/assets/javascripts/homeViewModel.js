
function DrinkItem(drinkName, drinkSize, drinkPercentage) {
    var self = this;

    self.name = drinkName;
    self.size = ko.observable(drinkSize);
    self.percentage = ko.observable(drinkPercentage);
    
/*
    self.time = ko.observable();
    self.date = ko.observable();    

    self.dateTime = ko.computed(function() {
        return new Date(self.date() + " " + self.time());
    });

    self.hoursSinceDrink = ko.computed(function() {
        var hours = Math.round((new Date() - self.dateTime()) / 1000 / 60 / 60);
        if (hours > 0) {
            return hours;
        }

        return 0;
    });

    self.minutesSinceDrink = ko.computed(function() {
    	var minutes = Math.round((new Date() - self.dateTime()) / 1000 / 60);
    	if (minutes > 0) {
    		return minutes;
    	}

    	return 0;
    })
*/

    self.gramsAlcohol = ko.computed(function() {
        return GetGramsAlcoholPerDrink(self.percentage(), self.size());
    });
}


function GetGramsAlcoholPerDrink(percentage, milliliters) {
    var alcoholDensity = 0.78;
    var gramsPer100ml = alcoholDensity * percentage;
    return gramsPer100ml * (milliliters / 100);
}


function GetBloodAlcoholConcentration(drink, gender, weight) {
    var effectiveWeight;
    if (gender === "Male") {
        effectiveWeight = weight * 0.7;
    }
    else if (gender === "Female") {
        effectiveWeight = weight * 0.6;
    }

    var bac = (drink.gramsAlcohol() / effectiveWeight);// - (0.0025 * drink.minutesSinceDrink());

    if (bac > 0) {
        return bac;
    }
    
    return 0;
}

function isEquivalent(objectA, objectB) {
    var aProps = Object.getOwnPropertyNames(objectA);
    var bProps = Object.getOwnPropertyNames(objectB);

    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        if (objectA[propName] !== objectB[propName]) {
            return false;
        }
    }

    return true;
}

function HomeViewModel() {
    var self = this;

    self.bodyWeight = ko.observable("70");
    self.gender = ko.observable("Male");
    self.hoursSince = ko.observable("0");

    self.drinks = ko.observableArray();

    self.addDrink = function(name, size, percentage) {
        self.drinks.push(new DrinkItem(name, size, percentage));
    }

    self.removeDrink = function(drink) {
        self.drinks.remove(drink);
    }

    self.duplicateDrink = function(drink) {
        self.drinks.push(new DrinkItem(drink.name, drink.size(), drink.percentage()));
    }

    self.bac = ko.computed(function() {
        var promille = 0;
        for (var i = 0; i < self.drinks().length; i++) {
            promille += GetBloodAlcoholConcentration(self.drinks()[i], self.gender(), self.bodyWeight());
        }

        if (self.drinks().length > 0) {
            promille -= (0.150 * self.hoursSince());
        }

        if (promille < 0) {
            promille = 0;
        }

        return promille;
    });
}

var vm = new HomeViewModel();

$(document).ready(function() {
    ko.applyBindings(vm);

    $('nav ul li').click(function() {
        $('.navActive').removeClass('navActive');
        $(this).addClass('navActive');
    });
});