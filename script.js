
var binding = ko.applyBindings(new IRCView());

function IRCView(){
    var self = this;

    self.channel = ko.observable();

    self.messages = ko.observableArray();

    // TODO
    // * make style prettier. something nice and flat :)
    // * add time constraint - http://jonthornton.github.io/jquery-timepicker/
    // **  use subscribed fields to update time

    var config = {
        host: "http://127.0.0.1:5984/", //"http://skinofstars.iriscouch.com/",
        db: "fridaybot" // "chatbot"
    }

    $rc = $.remoteCouch;
    $rc.config(config)

    var lastDay = new Date() - 12*60*60*1000;

    // this sets up initial view
    $rc.view('messages_by_date', { 
        keys: {
            startkey: '['+lastDay+']'
        }    
    }).then(function(data){

        // get the name of the room for the page title
        if (self.channel() == undefined) {
            self.channel(data.rows[0].value.room);
        }
            

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
    }).then(function(){
        $('.time').prettyDate({interval:100}); 
    });

    // setup longpoll and listeners
    // get the last change first
    $rc.changes(config.db).then(function(data){
        $rc.longpoll(config.db, data.last_seq);
    })

    // then wait.....
    $(document).on('longpoll-data', function(event, db, data){
        $.each(data, function(i,v) {
            //console.log(v.id)
            $rc.openDoc(v.id).then(function(doc){
                var date = new Date(doc.date); 
                self.messages.push({
                    "name":doc.user.name,
                    "text":doc.text,
                    "time":date.toISOString()
                });
            }); 
            $('.time').prettyDate({interval:100}); 
        })
    });

    $(document).on('longpoll-data-fridaybot', function(event, data){
        // if we wanted to be db specific i guess 
    });

    

}

