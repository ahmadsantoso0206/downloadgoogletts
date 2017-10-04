var url      = window.location.href;

$(document).ready(function(){
<<<<<<< HEAD
    var socket = io();   
    socket.emit('new message', 'test satu dua tiga');
=======
    var socket = io.connect(https://secure-garden-93788.herokuapp.comL:3000); 
>>>>>>> f4bf3290aaa76ed7f821d92bd741bf1c4d54998f
    $("#btnDownload").addClass('disabled');
    // var id = socket.io.engine.id;
    // alert(  id); 
    
    $("#ttsText").change(function(){
        if (this.value==""){
            $("#btnDownload").addClass('disabled');
        }else{
            fillText(this);
            $("#btnDownload").removeClass('disabled');
        }
    });
    $('#ttsText').on('paste', function () {
        if (this.value==""){
            $("#btnDownload").addClass('disabled');
        }else{
            fillText(this);
            $("#btnDownload").removeClass('disabled');
        }
      });

    $("#ttsText").keyup(function(){
        if (this.value==""){
            $("#btnDownload").addClass('disabled');
        }else{
            fillText(this);
            $("#btnDownload").removeClass('disabled');
        }
        
    });

    $("#ddlLang").change(function(){
        $("#btnDownload").prop('disabled', false);
    })

    function fillText(t){
        var query={};
        query["query"]=t.value;
        $.ajax({
            url:"/detect",
            type: 'post',
            data:query,
            success: function(res) {
                $("#spLang").html(res);
                $("#ddlLang option").filter(function() {
                    return this.text == res.charAt(0).toUpperCase() + res.slice(1); 
                }).attr('selected', true);
                var val=$("#ddlLang").val();
                $('#ddlLang option[value="'+ val +'"]').text(res.charAt(0).toUpperCase() + res.slice(1) + " - Detected");
            },
            error:function(xhr, status, error){
                console.log(xhr.responseText);
                return false;

            }
        });
    }
    $("#btnDownload").click(function(){
        var lang = $("#ddlLang").val();
        var ttsText = $("#ttsText").val();
        var splitTTS = ttsText.split(/[.!?]\s+/);
        var jumlahKalimat = splitTTS.length; 
        //return;
        var totalHuruf=0;
        
        var outputTTS=[];
        var z=0;
        var TTSTemp="";
        var maxLen=200;
        for (x=0; x<jumlahKalimat;x++){
            var kalimat = splitTTS[x];
            var TotalHurufPerKalimat = splitTTS[x].length+1;
            totalHuruf += TotalHurufPerKalimat;
            if (TotalHurufPerKalimat>maxLen){
                var jumlahPembagiKalimat = Math.ceil(TotalHurufPerKalimat/maxLen);
                var i=0;
                for (y=0; y<jumlahPembagiKalimat; y++){
                    var kata = kalimat.split(" ");
                    var kalimat2=[];
                    var jumlahHurufPerKata=0;
                    
                    for (z=i;z<kata.length;z++){
                        jumlahHurufPerKata+=(kata[i].length+1);
                        if (jumlahHurufPerKata>maxLen){
                            break;
                        }else{
                            
                            kalimat2.push(kata[i]);
                            i++;
                        }
                        
                    }
                    if (kalimat2.join(" ")!=""){
                        outputTTS.push(kalimat2.join(" ").replace(/(?:\r\n|\r|\n)/g, '. '));
                    }    
                    
                }
            }else{
                if (kalimat!=""){
                    outputTTS.push(kalimat.replace(/(?:\r\n|\r|\n)/g, '. '));
                }
                
            }
        }

        var outputTTS2=[];
        var panjangPerKalimat=[];

        for (x=0;x<outputTTS.length;x++){
            var kalimat=outputTTS[x];
            var panjangKalimat = kalimat.length;
            var kalimatBerikutnya="";
            var panjangKalimatBerikutnya =0;
            if (outputTTS[x+1]){
                kalimatBerikutnya = outputTTS[x+1];
                panjangKalimatBerikutnya = kalimatBerikutnya.length;
            }
            
            if (panjangKalimat+panjangKalimatBerikutnya<150){
                outputTTS2.push(kalimat+kalimatBerikutnya);
                panjangPerKalimat.push(panjangKalimat+panjangKalimatBerikutnya);
            }else{
                outputTTS2.push(kalimat);
                panjangPerKalimat.push(panjangKalimat);
            }
            
        }



        // for (x=0 ; x<=splitTTS.length-1 ; x++){
        //     if (z<splitTTS.length){
        //         totalHuruf += (splitTTS[z].length);
        //         if (totalHuruf>(x+1)*199){
        //             var pembagi2 = Math.ceil(splitTTS[z].length/199);
        //             for (n=1;n<=pembagi2;n++){
        //                 var start=(n-1) * 199;
        //                 var end=n*199;
        //                 if (end>splitTTS[z].length){
        //                     end=splitTTS[z].length;
        //                 }
        //                 var theText = splitTTS[z].substring(start,end);
        //                 TTSTemp += theText + " ";
        //                 z++;
        //             }
        //         }else{
        //             TTSTemp += splitTTS[z] + " ";
        //             z++;
        //         }
                
        //     }
            
        //     if (TTSTemp!=""){
        //         outputTTS.push(TTSTemp);
        //     }
        
        // }
        //console.log(outputTTS);
        // console.log(outputTTS2);
        // console.log(panjangPerKalimat);
       // return;
        var currentdate = new Date(); 
        var datetime = "" + currentdate.getFullYear() 
                        + (currentdate.getMonth()+1)  
                        + currentdate.getDate() 
                        + currentdate.getHours()  
                        + currentdate.getMinutes()  
                        + currentdate.getSeconds()
                        + currentdate.getMilliseconds();
        //console.log(datetime);
        //return;

        // console.log(outputTTS3);
        // return;
        var SOutputTTS = JSON.stringify(outputTTS2);
        //document.location.href="http://localhost:3000/join?";
        // console.log(SOutputTTS);
        // return;
        var linkdownloads = {};
        linkdownloads["clientID"]=datetime;
        jQuery.each(outputTTS, function(index, item) {
<<<<<<< HEAD
            linkdownloads["link" + index]=url+"api/tts?language="+ lang +"&query=" + encodeURIComponent(outputTTS[index])+"&total="+outputTTS.length+"&idx="+index+"&textlen="+outputTTS[index].length+"&prev=input";
=======
            linkdownloads["link" + index]="https://secure-garden-93788.herokuapp.com/api/tts?language="+ lang +"&query=" + encodeURIComponent(outputTTS[index])+"&total="+outputTTS.length+"&idx="+index+"&textlen="+outputTTS[index].length+"&prev=input";
>>>>>>> f4bf3290aaa76ed7f821d92bd741bf1c4d54998f
            //downloadMP3(linkdownloads["link"+ index],index);
        });
        if (outputTTS.length==1){
            downloadMP3(linkdownloads["link0"],"tts");
        }else{
            concatMP3(linkdownloads,socket,datetime);
        }
        //console.log(linkdownloads);
        
        //downloadMP3
        //var iframe = document.createElement('iframe');
        //iframe.src = linkdownloads["link0"];
        //document.body.appendChild(iframe);
        // setTimeout(function() {
                
        //     var imageElem = iframe.contentDocument.getElementsByTagName("video")[0];
        //     window.AudioContext = window.AudioContext || window.webkitAudioContext;
        //     var context = new AudioContext();
        //     var source = context.createMediaElementSource(imageElem);
        //     var destination = context.createMediaStreamDestination();
        //     var perrconnection = new RTCPeerConnection;
        //     perrconnection.addStream(destination.stream);
        //     var audioTracks = destination.stream.getAudioTracks();
        //     var track = audioTracks[0];
        //     console.log(track);
    

        // }, 1000); 

      
        //concatMP3(linkdownloads);
        
    });
});
//'X-Requested-With':'XMLHttpRequest'
function downloadMP3(link,i){
    var a = document.createElement('A');
    a.href = link;
    a.download = i+'.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // var audio=$("#audioControl");
    // $("#audioTarget").attr("src", link);
    // audio[0].load();
    // $("#myModalMP3").modal("show");
}

function concatMP3(SOutputTTS,socket,clientID){
    $("#spMsg").html("wait for a minute");
    var waitingList=[];
    waitingList.push("Real Entrepreneur wants to have better chance not a lot of money.");
    waitingList.push("No limitation to travel the world, because it is cycle.");
    waitingList.push("Quit for mistakes, enter for winner!");
    waitingList.push("Break the rules, obey your heart.");
    waitingList.push("One is just a form called number, love is a form of feeling, no one love, just true love.");
    waitingList.push("Provision comes not to lazy man!");
    waitingList.push("Judges can not pass judgement on people better than god!.");
    waitingList.push("Think big is true, but focus big is better!.");
    waitingList.push("History is written by you and god.”");
    waitingList.push("People do not care how big your sacrifices, they only car haw big your own!.");
    waitingList.push("There are two problem, you and your act.");
    waitingList.push("Money means nothing by bad attitudes.");
    waitingList.push("You have not to choose the choice, life is not choice, but story!");
    waitingList.push("If you want something you’ve never had, you must be willing to do something you’ve never done, Thomas Jefferson");
    waitingList.push("In this life we cannot always do great things. But we can do small things with great love, Mother Teresa");
    waitingList.push("Vision without execution is a daydream. Execution without vision is a nightmare, Japanese Proverb");
    waitingList.push("Life is short. There is no time to leave important words unsaid, Paulo Coelho");
    waitingList.push("The way to get started is to quit talking and begin doing, Walt Disney");
    waitingList.push("Minds are like parachutes – they only function when open, Thomas Dewar");
    waitingList.push("Success is a journey, not a destination, Ben Sweetland");
    waitingList.push("We worry about what a child will become tomorrow, yet we forget that he is someone today, Stacia Tauscher");
    waitingList.push("You don’t love a woman because she is beautiful, but she is beautiful because you love her, Anonymous");
    waitingList.push("The mother’s heart is the child’s schoolroom, Henry Ward Beecher");

    var intervalKataMutiara=setInterval(function(){
        var item = waitingList[Math.floor(Math.random()*waitingList.length)];
        $("#kataMutiara").html(item);
    }
    ,5000);
    
    socket.on(clientID, function (data) {
        $('#myModal').modal('show');
        var width=data['width'];
        $("#spMsg").html('processing ' + data +'%');
        $("#myModalLabel").html('Processing ' + data +'%');
        var $bar = $('.bar');
        $bar.width(data+'%');
        $bar.text(data+'%');
    });
    

    $.ajax({
        url:"/convert",
        type: 'post',
        data:SOutputTTS,
        success: function(res) {
            var songs={};
            songs["song"]=res;
            //setTimeout(function(){
            $.ajax({
                url:"/join",
                type: 'post',
                data:songs,
                progress: function(res){
                    $("#spMsg").html(res);
                },
                success: function(res) {
                    //window.location.href="";
                    if (res=="Successfuly Converted"){
                        var a = document.createElement('A');
                        a.href = '/script/all.mp3';
                        a.download = 'all.mp3';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        
                        $("#spMsg").html("done, enjoy!");
                        $("#myModalLabel").html("done, enjoy!");
                        $('.progress').removeClass('active');
                        $('#myModal').modal('hide');
                        $('.bar').width(0);
                        clearInterval(intervalKataMutiara);
                    }else{
                        $("#spMsg").html("ups, something went wrong!, please try again");
                        $('.progress').removeClass('active');
                        $('#myModal').modal('hide');
                        $('.bar').width(0);
                        clearInterval(intervalKataMutiara);
                    }
                
                   
                },
                error:function(xhr, status, error){
                    console.log(xhr.responseText);
                    return false;
                }
            });
        //},5000);
        },
        error:function(xhr, status, error){
        
            console.log(xhr.responseText);
            alert("Error deleting");
            return false;
        }
    });
}
