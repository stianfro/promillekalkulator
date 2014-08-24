
function DrinkItem(drinkName, drinkSize, drinkPercentage, drinkTime) {
    var self = this;

    self.name = ("Øl");
    self.size = ko.observable("500");
    self.percentage = ko.observable("4.7");
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

    self.gramsAlcohol = ko.computed(function() {
        return GetGramsAlcoholPerDrink(self.percentage(), self.size());
    });
}


function GetGramsAlcoholPerDrink(percentage, milliliters) {
    var alcoholDensity = 0.78;
    var gramsPer100ml = alcoholDensity * percentage;
    return gramsPer100ml * (milliliters / 100);
}


/*function GetBloodAlcoholConcentration(drinks, gender, weight, drinkingHours) {
    var gramsAlcohol = 0;
    for (var i = 0; i < drinks.length; i++) {
        gramsAlcohol += GetGramsAlcoholPerDrink(drinks[i].percentage(), drinks[i].size());
    }

    var effectiveWeight;
    if (gender === "Male") {
        effectiveWeight = weight * 0.7;
    }
    else if (gender === "Female") {
        effectiveWeight = weight * 0.6;
    }

    return (gramsAlcohol / effectiveWeight) - (0.15 * drinkingHours);
}*/

function GetBloodAlcoholConcentration(drink, gender, weight) {
    var effectiveWeight;
    if (gender === "Male") {
        effectiveWeight = weight * 0.7;
    }
    else if (gender === "Female") {
        effectiveWeight = weight * 0.6;
    }

    var bac = (drink.gramsAlcohol() / effectiveWeight) - (0.15 * drink.hoursSinceDrink());

    if (bac > 0) {
        return bac;
    }
    
    return 0;
}


function HomeViewModel() {
    var self = this;

    self.bodyWeight = ko.observable("70");
    self.gender = ko.observable("Male");

    self.drinks = ko.observableArray(
        //new DrinkItem("Øl", "500", "4.7", "20:00")
    );


    self.addDrink = function(name, size, percentage, time) {
        self.drinks.push(new DrinkItem(name, size, percentage, time));
    }

    self.removeDrink = function(drink) {
        self.drinks.remove(drink);
    }

    /*self.totalDrinkingHours = ko.computed(function() {
        var total = 0;
        for(var i = 0; i < self.drinks().length; i++) {            
            total += self.drinks[i].time;
        }

        return total;
    });*/ 
    //self.test = GetBloodAlcoholConcentration(self.drinks[0], self.gender(), self.bodyWeight(), 0);

    self.bac = ko.computed(function() {
        var promille = 0;
        for (var i = 0; i < self.drinks().length; i++) {
            promille += GetBloodAlcoholConcentration(self.drinks()[i], self.gender(), self.bodyWeight());
        }
        return promille;
    });
}

var vm = new HomeViewModel();

$(document).ready(function() {
    ko.applyBindings(vm);    
});
