
var binding = ko.applyBindings(new IRCView());

function IRCView(){
    var self = this;

    self.messages = ko.observableArray();

    // TODO
    // * make style prettier. something nice and flat :)
    // * add time constraint - http://jonthornton.github.io/jquery-timepicker/
    // **  use subscribed fields to update time
    // * pretty print time - http://bassistance.de/jquery-plugins/jquery-plugin-prettydate/

    // * <strike> build the query using $.couch plugin - eg $db = $.couch.db("chatbot") </strike>
    // * <strike> add $.couch.db.changes listener if time is current </strike>
    // cors hell
    // $.couch.urlPrefix = "//skinofstars.iriscouch.com";
    // $.couch.config({crossDomain:true, dataType:"JSONP"});</strike>


    
    $.ajax({
        url: "//skinofstars.iriscouch.com/chatbot/_design/messages_by_date/_view/messages_by_date?startkey=[1367339768307]",
        type : 'GET',
        dataType : "JSONP",
        success: function (data){

            $.each(data.rows, function (index, item) {

                // we could have pushed item.value here
                // but doing a bit of date conversion 
                var date = new Date(item.value.time); 
                self.messages.push({
                    "name":item.value.name,
                    "text":item.value.text,
                    "time":date.toISOString()
                });
            });
        }
    });
}
