app.filter('uah', function(){
    return function(element){
        if(!element) return;
        if(element>100){
            return element + " грн";
        } else {
            return element + ".00" + " грн";
        }
    }
});