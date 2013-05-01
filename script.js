
var binding = ko.applyBindings(new IRCView());

function IRCView(){
    var self = this;

    self.messages = ko.observableArray();

    // TODO
    // * make style prettier. something nice and flat :)
    // * add time constraint - http://jonthornton.github.io/jquery-timepicker/
    // **  use subscribed fields to update time
    // * pretty print time - http://bassistance.de/jquery-plugins/jquery-plugin-prettydate/

    $rc = $.remoteCouch;
    $rc.config({
        host: "http://skinofstars.iriscouch.com/",
        db: "chatbot"
    });

    //console.log($rc.status());

    var lastDay = new Date() - 24*60*60*1000;

    // this sets up initial view
    $rc.view('messages_by_date', { 
        keys: {
            startkey: '['+lastDay+']'
        }    
    }).then(function(data){
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
    });

    // setup longpoll and listeners
    $rc.longpoll('chatbot');
    $(document).on('longpoll-data', function(data){
        console.log(data);
        // TODO .... something
    });

}
