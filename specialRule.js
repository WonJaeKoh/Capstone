
$(function() {
    init();
    addEvent();
})

function init() {
    makeCanvas();
}

function addEvent() {
    grid();
    controlImage();
    controlObject();
    controlDraw();
    design();
}

function grid() {
    drawGrid();
    controlGrid();
}

function controlImage(){
    imageOnCanvas();
    resizeByWindow();
}

function controlObject(){
    deleteObject();
    boundary();
}

function controlDraw(){
    brushSize();
    brushColor()
    quitdrawESC();
    drawType();
    brushSizeBox();
    color();
}

function design(){
    gridIconChange();
    filename();
    downloadButton();
}


function makeCanvas(){
    var canvas = new fabric.Canvas("canvas");
    //var canvasInvisible = new fabric.Canvas("invisibleCanvas");
    var containerHeight=($("#container").height()-40);
    var canvasContainer=$(".canvas-container");
    canvasContainer.css('margin',"auto");
    canvas.backgroundColor='#D8D8D8';
    canvas.setWidth(0.7*containerHeight);
    canvas.setHeight(containerHeight*0.9);
    //TODO JQuery로 변경
    document.getElementById("canvas").fabric = canvas;
    //document.getElementById("invisibleCanvas").fabric = canvasInvisible;
}




function clearCanvas() {
  
    var canvas = document.getElementById("canvas").fabric;
   // var invisibleCanvas = document.getElementById("invisibleCanvas").fabric;
    canvas.clear();
   // invisibleCanvas.clear();
}




function drawGrid(gridsize) {
    var canvas = document.getElementById("canvas").fabric;
    for(var x = 1; x < (canvas.height/gridsize) ; x++) {
        canvas.add(new fabric.Line([0, gridsize*x, canvas.width, gridsize*x],
            { stroke: "rgba(0, 0, 0, 0.05)", strokeWidth: 1, selectable:false, hoverCursor: 'default'}));
    }

    for(var x=1;x<(canvas.width/gridsize);x++) {
        canvas.add(new fabric.Line([gridsize*x, 0, gridsize*x, canvas.height],
            { stroke: "rgba(0, 0, 0, 0.05)", strokeWidth: 1, selectable:false, hoverCursor: 'default'}));
        
    }
/*     console.log($('body').css('width'))
    console.log($('body').css('height')) */
}

function isCheck(){
    var chechbox = $('#gridCheckbox');

    if(chechbox.prop('checked')) {
        return true;
    }

    else{
        return false;
    }
}

function controlGrid() {
    var checkbox = $('#gridCheckbox');

    
    checkbox.on('click', function() {
        //is checked
        if(isCheck()) {
            drawGrid(30);
        }
        else if(!isCheck()) {
            removeGrid();
        } else {
            console.error("unknown error");
        }
    });
}

function removeGrid() {
    var canvas = document.getElementById("canvas").fabric;
    var objects = canvas.getObjects('line');
    for (var i in objects) {
        canvas.remove(objects[i]);
    };
}

function imageOnCanvas() {
    var canvas = document.getElementById("canvas").fabric;
    
    $("#uploader").on("change",function(e) {
        //TODO checkbox 확인
        if(isCheck()){
            removeGrid();
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log($("#uploader").attr('src'));
            clearCanvas();
            console.log(e.target);
            var image = new Image();
           // console.log(e.target);
            image.src = e.target.result;
            $('#uploader').attr('src',e.target.result);
           // console.log(e.target.result);
            //console.log(image.width);
            
            image.onload = function() {
           // sectionResize();
            var img = new fabric.Image(image);
            img.set({
                hasControls: false,
                
                selection: false,       
                lockRotation:false,

                hoverCursor: 'default',
                hasRotatingPoint: false,
                hasBorders: false,
                transparentBorder: false,

                selectable: false,
                id: 'medicalImage'
            });
            //TODO 함수로 만들기
            var contentAreaHeight = ($("#container").height()-40);
            var contentAreaWidth = $("#container").width();
            var rateContentArea=contentAreaWidth/contentAreaHeight;
            var rateImage=img.width/img.height;
            if(rateContentArea>rateImage){
                var pictureWidth = contentAreaHeight * rateImage; //img.width / img.height
                img.scaleToHeight(contentAreaHeight*0.9);
                resizeCanvasByImg(pictureWidth*0.9,contentAreaHeight*0.9);
            }
            else if(rateContentArea<rateImage){
                var pictureHeight=contentAreaWidth*img.height/img.width;
                img.scaleToWidth(contentAreaWidth*0.9);
                resizeCanvasByImg(contentAreaWidth*0.9,pictureHeight*0.9);
            }
            
            //imgRate()
            canvas.add(img).centerObject(img).renderAll();
            if(isCheck()){
                drawGrid(30);
            }
            $('#filename').css('visibility', 'visible');
          }
        }
        if(e.target.files[0] != null){
            reader.readAsDataURL(e.target.files[0]);
        }
        if(isCheck()) {
            drawGrid(30);
        }
        
    });
}


function resizeCanvasByImg(widthSize,heightSize) {
    var canvas = document.getElementById("canvas").fabric;
    /* var container=document.getElementById("container");
    var containerWidth=size;
    container.style.width=containerWidth+'px'; */
    canvas.setWidth(widthSize);
    canvas.setHeight(heightSize);
}

function resizeByWindow(){
    window.addEventListener('resize',function() {
        
        containersize();
        var canvas = document.getElementById("canvas").fabric;
        var containerHeight = ($("#container").height()-40)*0.9;
        var containerWidth = $("#container").width()*0.9;
        canvas.setHeight(containerHeight);
        canvas.setWidth(containerHeight*0.7);
        var rateContentArea=containerWidth/containerHeight;
        canvas.getObjects().forEach(function(o) {
            if(o.id == 'medicalImage') {
                var rateImage=o.width/o.height;
                if(rateContentArea>rateImage) {
                    o.scaleToHeight(containerHeight);
                    canvas.setWidth((containerHeight)*o.width/o.height);
                    canvas.setHeight(containerHeight);
                }

                else {
                    o.scaleToWidth(containerWidth);
                    canvas.setWidth(containerWidth);
                    canvas.setHeight((containerWidth*o.height/o.width));
                }
            }  
        })
    });
}



function imgRate(){
    
    var contentAreaHeight = $("#container").height();
    var contentAreaWidth = $("#container").width();
    var img, rateImage;
    var rateContentArea=contentAreaWidth/contentAreaHeight;
    for (var i = 0; i < objectsCount; i++) {
        if (objects[i].type && objects[i].type == "image"){
            if (objects[i].id==='medicalImage') {
                object = objects[i];
                img;
            }
        } 
    }
    rateImage=img.width/img.height;
    if(rateContentArea>rateImage||rateContentArea==rateImage){
        var pictureWidth = contentAreaHeight * rateImage;
        img.scaleToHeight(contentAreaHeight);
        resizeCanvasByImg(pictureWidth,contentAreaHeight);
    }
    else if(rateContentArea<rateImage){
        var pictureHeight=contentAreaWidth*img.height/img.width;
        img.scaleToWidth(contentAreaWidth);
        resizeCanvasByImg(contentAreaWidth,pictureHeight);
    }    
    else{
        console.error("");
    }
}


function containersize() {
    var container = $(".canvasContainer");
    var buttonplace = $(".button_place");
    var footer=$("footer");
    var header=$("header");
    var containerHeight = innerHeight-buttonplace.outerHeight(true)-footer.outerHeight()-header.outerHeight();

    container.css("height", containerHeight);

}

function condition(){
    fabric.Object.prototype.noScaleCache = false;
    if(!isfile()) {
        return;
    }

    if($(".canvasContainer__drawBox").css('visibility')=='visible'){
       quitdraw();
    }

    var canvas = document.getElementById("canvas").fabric;
    console.log($("#conditionButton").css('background-color'));

    //quit condition
    if(($("#conditionButton").css('background-color')) =='rgb(255, 102, 102)') {
        $("#conditionButton").css('background-color',"#E6E6E6");
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        var rects=[];
        var obj = canvas.getObjects();
        
        canvas.selection = true;
        rects=canvas.getObjects('rect');
        for(var i in rects) {
            if(rects[i].width==0) {
                canvas.remove(rects[i]);
            }
        }
        for(var i in obj) {
            if(obj[i].id != 'medicalImage'){
                obj[i].selectable = true;
                canvas.discardActiveObject();
                canvas.renderAll();
                obj[i].hoverCursor='move';
            }
        }
        return;
    }
    
    //quit action
    if(($("#actionButton").css('background-color')) =='rgb(102, 102, 255)') {
        $("#actionButton").css('background-color',"#E6E6E6");
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        var rects=[];
        var obj = canvas.getObjects();
        
        canvas.selection = true;
        rects=canvas.getObjects('rect');
        for(var i in rects) {
            if(rects[i].width==0) {
                canvas.remove(rects[i]);
            }
        }
        for(var i in obj) {
            if(obj[i].id != 'medicalImage'){
                obj[i].selectable = true;
                canvas.discardActiveObject();
                canvas.renderAll();
                obj[i].hoverCursor='move';
            }
        }
    }
    
    
    canvas.off('mouse:down');
    canvas.selection = false;
    
    $(".material-icons").css('background-color','#E6E6E6');
    $("#conditionButton").css('background-color','rgb(255,102,102)');
    canvas.discardActiveObject();
    canvas.renderAll();
    var obj = canvas.getObjects();
    for(var i in obj) {
        obj[i].selectable=false;
        obj[i].hoverCursor='default';
    }

    var rectangle, isDown, origX, origY;
    canvas.on('mouse:down', function(o) {
        canvas.discardActiveObject();
        canvas.renderAll();
        obj = canvas.getObjects();

        canvas.selection = false;
       
        if(isCheck()) {
            removeGrid();
            drawGrid(30);
        }
        var pointer = canvas.getPointer(o.e);
        isDown = true;
        origX = pointer.x;
        origY = pointer.y;

        rectangle = new fabric.Rect({
            left: origX,
            top: origY,
            fill: '',
            stroke: 'red',
            strokeWidth: 2,
            strokeUniform: true,
            hoverCursor: 'default'
        });
        canvas.add(rectangle);
        canvas.setActiveObject(rectangle);
    });

    canvas.on('mouse:move', function(o) {
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);
    if(origX>pointer.x) {
        rectangle.set({ left: pointer.x });
    }
    else {
        rectangle.set({ left: origX });
    }
    if(origY>pointer.y) {
        rectangle.set({ top: pointer.y });
    }
    else {
        rectangle.set({ top:origY });
    }
    
    rectangle.set({ width: Math.abs(origX - pointer.x) });
    rectangle.set({ height: Math.abs(origY - pointer.y) });
    canvas.renderAll();
    });

    canvas.on('mouse:up', function() {
        isDown = false;
        var rects=[];
        var obj = canvas.getObjects();
        canvas.selection = true;
        //cut
        rects=canvas.getObjects('rect');
        for(var i in rects) {
            if(rects[i].width==0) {
                canvas.remove(rects[i]);
            }
        }
        for(var i in obj) {
            if(obj[i].id != 'medicalImage'){
                obj[i].selectable = false;
                canvas.discardActiveObject();
                canvas.renderAll();
            }
        }
        if(isCheck()){
            removeGrid();
            drawGrid(30);
        }
        
    });

}



function action(){
    
    fabric.Object.prototype.noScaleCache = false;
    if(!isfile()) {
        return;
    }

    if($(".canvasContainer__drawBox").css('visibility')=='visible'){
       quitdraw();
    }

    var canvas = document.getElementById("canvas").fabric;
    console.log($("#conditionButton").css('background-color'));


    //quit condition
    if(($("#conditionButton").css('background-color')) =='rgb(255, 102, 102)') {
        $("#conditionButton").css('background-color',"#E6E6E6");
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        var rects=[];
        var obj = canvas.getObjects();
        
        canvas.selection = true;
        rects=canvas.getObjects('rect');
        for(var i in rects) {
            if(rects[i].width==0) {
                canvas.remove(rects[i]);
            }
        }
        for(var i in obj) {
            if(obj[i].id != 'medicalImage'){
                obj[i].selectable = true;
                canvas.discardActiveObject();
                canvas.renderAll();
                obj[i].hoverCursor='move';
            }
        }
    }

    //quit action
    if(($("#actionButton").css('background-color')) =='rgb(102, 102, 255)') {
        $("#actionButton").css('background-color',"#E6E6E6");
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        var rects=[];
        var obj = canvas.getObjects();
        
        canvas.selection = true;
        rects=canvas.getObjects('rect');
        for(var i in rects) {
            if(rects[i].width==0) {
                canvas.remove(rects[i]);
            }
        }
        for(var i in obj) {
            if(obj[i].id != 'medicalImage'){
                obj[i].selectable = true;
                canvas.discardActiveObject();
                canvas.renderAll();
                obj[i].hoverCursor='move';
            }
        }
        return;
    }
    
    
    
    canvas.off('mouse:down');
    canvas.selection = false;
    
    $(".material-icons").css('background-color','#E6E6E6');
    $("#actionButton").css('background-color','rgb(102, 102, 255)');
    canvas.discardActiveObject();
    canvas.renderAll();
    var obj = canvas.getObjects();
    for(var i in obj) {
        obj[i].selectable=false;
        obj[i].hoverCursor='default';
    }

    var rectangle, isDown, origX, origY;
    canvas.on('mouse:down', function(o) {
        canvas.discardActiveObject();
        canvas.renderAll();
        obj = canvas.getObjects();

        canvas.selection = false;
       
        if(isCheck()) {
            removeGrid();
            drawGrid(30);
        }
        var pointer = canvas.getPointer(o.e);
        isDown = true;
        origX = pointer.x;
        origY = pointer.y;

        rectangle = new fabric.Rect({
            left: origX,
            top: origY,
            fill: '',
            stroke: 'blue',
            strokeWidth: 2,
            strokeUniform: true,
            hoverCursor: 'default'
        });
        canvas.add(rectangle);
        canvas.setActiveObject(rectangle);
    });

    canvas.on('mouse:move', function(o) {
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);
    if(origX>pointer.x) {
        rectangle.set({ left: pointer.x });
    }
    else {
        rectangle.set({ left: origX });
    }
    if(origY>pointer.y) {
        rectangle.set({ top: pointer.y });
    }
    else {
        rectangle.set({ top:origY });
    }
    
    rectangle.set({ width: Math.abs(origX - pointer.x) });
    rectangle.set({ height: Math.abs(origY - pointer.y) });
    canvas.renderAll();
    });

    canvas.on('mouse:up', function() {
        isDown = false;
        var rects=[];
        var obj = canvas.getObjects();
        canvas.selection = true;
        //cut
        rects=canvas.getObjects('rect');
        for(var i in rects) {
            if(rects[i].width==0) {
                canvas.remove(rects[i]);
            }
        }
        for(var i in obj) {
            if(obj[i].id != 'medicalImage'){
                obj[i].selectable = false;
                canvas.discardActiveObject();
                canvas.renderAll();
            }
        }
        if(isCheck()){
            removeGrid();
            drawGrid(30);
        }
        
    });

    
}

function canDraw() {
    if(!isfile()) {
        return;
    } 

    var canvas = document.getElementById("canvas").fabric;
    //quit condition
    if(($("#conditionButton").css('background-color')) =='rgb(255, 102, 102)') {
        $("#conditionButton").css('background-color',"#E6E6E6");
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        var rects=[];
        var obj = canvas.getObjects();
        
        canvas.selection = true;
        rects=canvas.getObjects('rect');
        for(var i in rects) {
            if(rects[i].width==0) {
                canvas.remove(rects[i]);
            }
        }
        for(var i in obj) {
            if(obj[i].id != 'medicalImage'){
                obj[i].selectable = true;
                canvas.discardActiveObject();
                canvas.renderAll();
                obj[i].hoverCursor='move';
            }
        }
    }
    
    //quit action
    if(($("#actionButton").css('background-color')) =='rgb(102, 102, 255)') {
        $("#actionButton").css('background-color',"#E6E6E6");
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        var rects=[];
        var obj = canvas.getObjects();
        
        canvas.selection = true;
        rects=canvas.getObjects('rect');
        for(var i in rects) {
            if(rects[i].width==0) {
                canvas.remove(rects[i]);
            }
        }
        for(var i in obj) {
            if(obj[i].id != 'medicalImage'){
                obj[i].selectable = true;
                canvas.discardActiveObject();
                canvas.renderAll();
                obj[i].hoverCursor='move';
            }
        }
    }

    var rects = canvas.getObjects('rect');
    canvas.off('mouse:up');
    canvas.off('mouse:down');
    for(var i in rects) {
        rects[i].hoverCursor = 'default';
    }
    if($(".canvasContainer__drawBox").css('visibility') == 'hidden'){
        $(".material-icons").css('background-color','#E6E6E6');
        $("#drawButton").css('background-color','skyblue');
        $(".canvasContainer__drawBox").css('visibility','visible');
        if($("#drawType  option:selected").val() =='pen' ) {
            drawFree();
        }
        else if($("#drawType  option:selected").val() =='square') {
            drawRect();
            for(var i in rects) {
                if(rects[i].fill!='') {
                    rects[i].hoverCursor = 'move';
                }
            }
        }

        else {
            console.error('candraw');
        }
    }

    else if($(".canvasContainer__drawBox").css('visibility') == 'visible') {
        for(var i in rects) {
            if(rects[i].fill!='') {
                rects[i].hoverCursor = 'move';
            }
        }
        $(".material-icons").css('background-color','#E6E6E6');
        quitdraw();
    }
}

function drawType() {
    var canvas = document.getElementById("canvas").fabric;
    
    $('#drawType').on('change',function() {
        if(this.value == 'pen') {
            drawFree();
        }

        else if(this.value == 'square') {
            canvas.on('mouse:down',drawRect())
        }

        else {
            console.error('drawType');
        }
    })
}



function drawRect() {
    
    if(($('.canvasContainer_drawBox').css('visibility')=='hidden') || ($(".canvasContainer_drawBox option:selected").val() == 'pen')){

        return;
    }
    
    var canvas = document.getElementById("canvas").fabric;
    canvas.isDrawingMode=false;
    var obj = canvas.getObjects();
    for(var i in obj) {
        obj[i].selectable=false;
    }
    canvas.discardActiveObject();
    canvas.renderAll();
    
    console.log(obj);

    var rectangle, isDown, origX, origY;
    console.log(canvas.selection);
    canvas.on('mouse:down', function(o) {
        canvas.discardActiveObject();
        canvas.renderAll();
        obj = canvas.getObjects();

        canvas.selection = false;
        for(var i in obj) {
            obj[i].selectable=false;
        }
        if(isCheck()) {
            removeGrid();
            drawGrid(30);
        }
        var pointer = canvas.getPointer(o.e);
        isDown = true;
        origX = pointer.x;
        origY = pointer.y;

        rectangle = new fabric.Rect({
            left: origX,
            top: origY,
            fill: $("#drawColor option:selected").val(),
            stroke: $("#drawColor option:selected").val(),
            strokeWidth: 2,
            strokeUniform: true,
            hoverCursor: 'default'
        });
        canvas.add(rectangle);
        canvas.setActiveObject(rectangle);
    });

    canvas.on('mouse:move', function(o) {
    if (!isDown) return;
    var pointer = canvas.getPointer(o.e);
    if(origX>pointer.x) {
        rectangle.set({ left: pointer.x });
    }
    else {
        rectangle.set({ left: origX });
    }
    if(origY>pointer.y) {
        rectangle.set({ top: pointer.y });
    }
    else {
        rectangle.set({ top:origY });
    }
    
    rectangle.set({ width: Math.abs(origX - pointer.x) });
    rectangle.set({ height: Math.abs(origY - pointer.y) });
    canvas.renderAll();
    });

    canvas.on('mouse:up', function() {
        isDown = false;
        var rects=[];
        var obj = canvas.getObjects();
        console.log('action');
        canvas.selection = true;
        rects=canvas.getObjects('rect');
        for(var i in rects) {
            if(rects[i].width==0) {
                canvas.remove(rects[i]);
            }
        }
        for(var i in obj) {
            if(obj[i].id != 'medicalImage'){
                obj[i].selectable = false;
                canvas.discardActiveObject();
                canvas.renderAll();
            }
        }
        if(isCheck()){
            removeGrid();
            drawGrid(30);
        }
        
    });

}

/* function rangeValue(){
    var range = $('#drawingLineWidth');
    range.on('input', function(){
        console.log(this.value);
        console.log(this);
        brushWidth=this.value;
        console.log(brushWidth);
    });

}; */



function drawFree() {

    
    var canvas = document.getElementById("canvas").fabric;
    canvas.off('mouse:up');
    canvas.off('mouse:down');


    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = parseInt((document.getElementById('sliderValue').innerHTML),10);

    canvas.freeDrawingBrush.color = $("#drawColor option:selected").val();
   
    return;
}

function brushSize() {
    var canvas = document.getElementById("canvas").fabric;
    $(".container__brushRange").on('change',function() {
       // console.log(parseInt((document.getElementById('sliderValue').innerHTML),10));
        canvas.freeDrawingBrush.width = parseInt((document.getElementById('sliderValue').innerHTML),10);
    })
}


function sliderValue(sVal) {
	var obValueView = document.getElementById("sliderValue");
	obValueView.innerHTML = sVal
}

function brushColor() {
    var canvas = document.getElementById("canvas").fabric;
    $("#drawColor").on('change',function(){
        canvas.freeDrawingBrush.color = $("#drawColor option:selected").val();
    })
}


function brushSizeBox() {
    if($("#drawType option:selected").val()=='pen') {
        $('.canvasContainer').css('display','visible');
    }

    $("#drawType").on('change', function() {
        console.log("enter");
        if($("#drawType option:selected").val()=='pen') {
            $('.canvasContainer__brushSize').css('display','block');
        }

        else {
            $('.canvasContainer__brushSize').css('display','none');
        }

    })
}

/* function draw(){
    
    if(!isfile()) {
        return;
    } 

    if($(".canvasContainer__drawBox").css('visibility')!='visible'){
       
        if(buttonFlag){
            
            buttonFlag=false;

        }

        else{
            return;
        }
    }
    
    var canvas = document.getElementById("canvas").fabric;
    
    var rectangle, isDown, origX, origY; 

        if($(".canvasContainer__drawBox").css('visibility')=='hidden'){
        $('#actionButton').css('background-color','gray');
        $('#conditionButton').css('background-color','gray');
        $(".canvasContainer__drawBox").css('visibility','visible');
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = parseInt((document.getElementById('sliderValue').innerHTML),10);

        canvas.freeDrawingBrush.color = '#000000';
        var isDrawing = false;
        canvas.on('mouse:down', function({e}) {
            isDrawing = true;
            }).on('mouse:up', function({e}) {
                isDrawing = false;
                buttonFlag = true;  
                
            }).on('mouse:move', function({e}) {
            if (isDrawing) {
                var pointer = canvas.getPointer(e);
            }
        });
    }

    else if($(".canvasContainer__drawBox").css('visibility')=='visible') {
        canvas.isDrawingMode = false;
        buttonFlag=true;
        $(".canvasContainer__drawBox").css('visibility','hidden');
        $('#conditionButton').css('background-color','#E6E6E6');
        $('#actionButton').css('background-color','#E6E6E6');
    }

   
    return;
}
 */

function quitdraw() {

    var canvas = document.getElementById("canvas").fabric;
    var obj = canvas.getObjects();
    var rects=canvas.getObjects('rect');
    if($(".canvasContainer__drawBox").css('visibility')=='visible') {
        canvas.isDrawingMode=false;
        
        for(var i in obj) {
            if(obj[i].id !='medicalImage') {
                obj[i].selectable=true;
            }
        }
        canvas.selection=true;
        $(".canvasContainer__drawBox").css('visibility','hidden')
        canvas.off('mouse:down');
        canvas.off('mouse:up');
        for(var i in rects) {
            rects[i].hoverCursor = 'move';
        }
        $(".material-icons").css('background-color','#E6E6E6');
        if(isCheck()){
            removeGrid();
            drawGrid(30);
        }
    }
}

function quitdrawESC() {
    $(document).keydown(function(event) {
        if (event.which == 27){
            
            var canvas = document.getElementById("canvas").fabric;
            
            //quit condition
            if(($("#conditionButton").css('background-color')) =='rgb(255, 102, 102)') {
                $("#conditionButton").css('background-color',"#E6E6E6");
                canvas.off('mouse:down');
                canvas.off('mouse:move');
                canvas.off('mouse:up');
                var rects=[];
                var obj = canvas.getObjects();
                
                canvas.selection = true;
                rects=canvas.getObjects('rect');
                for(var i in rects) {
                    if(rects[i].width==0) {
                        canvas.remove(rects[i]);
                    }
                }
                for(var i in obj) {
                    if(obj[i].id != 'medicalImage'){
                        obj[i].selectable = true;
                        canvas.discardActiveObject();
                        canvas.renderAll();
                        obj[i].hoverCursor='move';
                    }
                }
            }
            
            //quit action
            if(($("#actionButton").css('background-color')) =='rgb(102, 102, 255)') {
                $("#actionButton").css('background-color',"#E6E6E6");
                canvas.off('mouse:down');
                canvas.off('mouse:move');
                canvas.off('mouse:up');
                var rects=[];
                var obj = canvas.getObjects();
                
                canvas.selection = true;
                rects=canvas.getObjects('rect');
                for(var i in rects) {
                    if(rects[i].width==0) {
                        canvas.remove(rects[i]);
                    }
                }
                for(var i in obj) {
                    if(obj[i].id != 'medicalImage'){
                        obj[i].selectable = true;
                        canvas.discardActiveObject();
                        canvas.renderAll();
                        obj[i].hoverCursor='move';
                    }
                }
            }
            quitdraw();
        }
    });
}




function boundary() {
    var canvas = document.getElementById("canvas").fabric;
    canvas.on('object:moving', function (e) {
        var obj = e.target;
        if(obj.path!=null || obj.fill!=''){
            return;
        }
        obj.setCoords();
        canvas.renderAll();
        if(obj.getBoundingRect().height > canvas.height || obj.getBoundingRect().width > canvas.width) {
            return;
        }
        if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
          obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
          obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        }
        if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width) {
          obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
          obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        }
      });
}

function deleteObject() {
var canvas = document.getElementById("canvas").fabric;
    $(document).keydown(function(event) {
        if (event.which == 8 || event.which == 46){
            if(Array.isArray(canvas.getActiveObject()._objects)) {
                var num = canvas.getActiveObject()._objects.length;

                for( var i=0;i<num;i++) {
                    canvas.remove(canvas.getActiveObject()._objects[i]);
                }
            }

            
            canvas.remove(canvas.getActiveObject());
            canvas.discardActiveObject();
            canvas.renderAll();
        }
       
    });
}



function crop() {
    var canvas = document.getElementById("canvas").fabric;
   // var invisibleCanvas=document.getElementById("invisibleCanvas").fabric;
    var rects=canvas.getObjects('rect');
    var paths=canvas.getObjects('path');
    var img=[];
    var sourceImage= new Image();
    var imgNum=0;
    sourceImage.src=$("#uploader").attr('src');
    var multiple=sourceImage.width/canvas.width;
    for(var i in rects) {
        var rectLeft,rectTop;
        if(relativeCoord(rects[i].aCoords).xmin<0)
        {
            rectLeft=0;
        }
        else{
            rectLeft=relativeCoord(rects[i].aCoords).xmin*canvas.width;
        }

        if(relativeCoord(rects[i].aCoords).ymin<0) {
            rectTop=0;
        }
        else {
            rectTop=relativeCoord(rects[i].aCoords).ymin*canvas.height;
        } 
        //TODO crop할 떄 모든 rects visible false
        for(var j in rects) {
            rects[j].visible=false;
        }
        for(var j in paths) {
            paths[j].visible=false;
        }
        if(isCheck()) {
            removeGrid();
        }
        if(rects[i].stroke=='red') {
            img[imgNum] = canvas.toDataURL({
                format: 'jpeg',
                left: rectLeft,
                top: rectTop,
                width: (relativeCoord(rects[i].aCoords).xmax-relativeCoord(rects[i].aCoords).xmin)
                        *canvas.width,
                height: (relativeCoord(rects[i].aCoords).ymax-relativeCoord(rects[i].aCoords).ymin)
                        *canvas.height,
                multiplier: multiple
            })
            //console.log(img[imgNum]);
            imgNum++;

        }
        for(var j in rects) {
            rects[j].visible=true;
        }
        for(var j in paths) {
            paths[j].visible=true;
        }
        if(isCheck()) {
            drawGrid(30);
        }
    }
    //console.log(img);
    console.log(img);
    return img;
  
}



function relativeCoord(absCoords) {
    var canvas = document.getElementById("canvas").fabric;
 // var originX, originY, rectWidth, rectHeight, relX, relY, relWidth, relHeight;
   var relminX, relminY, relmaxX, relmaxY;
    var relCoord = new Object();
  /*   originX = absCoords.tl.x;
    originY = absCoords.tl.y;
    rectWidth = absCoords.tr.x-absCoords.tl.x;
    rectHeight = absCoords.bl.y-absCoords.tl.y; */
    relminX = absCoords.tl.x/canvas.width;
    relminY = absCoords.tl.y/canvas.height;
    relmaxX = absCoords.br.x/canvas.width;
    relmaxY = absCoords.br.y/canvas.height;
/*  relWidth = rectWidth/canvas.width;
    relHeight = rectHeight/canvas.height; */
    
    relCoord.xmin = relminX;
    relCoord.ymin = relminY;
    relCoord.xmax = relmaxX;
    relCoord.ymax = relmaxY;
/*  relCoord.x=relX;
    relCoord.y=relY;
    relCoord.width=relWidth;
    relCoord.height=relHeight; */
    return relCoord;

}


function downloadImg() {
     
   // pastePath();
    var canvas = document.getElementById("canvas").fabric;
    var rects=canvas.getObjects('rect');
    var file=document.getElementById('uploader').files;
    var sourceImage= new Image();
    sourceImage.src=$("#uploader").attr('src');
    var multiple=sourceImage.width/canvas.width;
    for(var i in rects){
        if(rects[i].fill == ''){
            rects[i].visible=false;
        }
    }
    var image = canvas.toDataURL({
        format:'jpeg',
        multiplier: multiple
    });
    var link = document.createElement('a');
    link.download='(revised)'+document.getElementById('filename').innerHTML;
    link.href = image;
    link.click();
    for(var i in rects){
        rects[i].visible=true;
    }
  };


//image hidden(display none) src 소스를 넣어서
//mediaquery--후순위
function makeJSON() {
    var canvas = document.getElementById("canvas").fabric;
  //  var invisibleCanvas = document.getElementById("invisibleCanvas").fabric;
    var rects=canvas.getObjects('rect');
    var rectAction=[];
    var rectCondition=[];
    var actionNum = 0;
    var rectNum=0;
    var json=new Object();
    var condition = new Object();
    //var sourceImageSize= new Object();
    var conditionArray= new Array();
    var actionArray = new Array();
    for(var i in rects) {
        if(rects[i].stroke=='red') {
            rectNum = rectNum + 1;
            rectCondition.push(rects[i]);
        }
        else if(rects[i].stroke=='blue') {
           actionNum = actionNum + 1; 
           rectAction.push(rects[i]);
        }
    }
    var img;
    img=$("#uploader").attr('src');

    condition.sourceImage=img;
    var cropImg=crop();
    condition.conditionImage=cropImg;
  //  console.log(invisibleCanvas.width);
   // console.log(img);
    /*sourceImageSize.width=invisibleCanvas.width;
    sourceImageSize.height=invisibleCanvas.height;
    condition.sourceImageSize=sourceImageSize; */
   // console.log(rectAction[0].aCoords);
    for(var i in rectCondition) {
        var conditionCoordinate = new Object();

        conditionCoordinate=cutCoordinate(conditionCoordinate,rectCondition[i]);

        console.log(conditionCoordinate);
        conditionArray.push(conditionCoordinate);
    }
    for(var i in rectAction) {
        var actionCoordinate = new Object();
        
        conditionCoordinate=cutCoordinate(actionCoordinate,rectAction[i]);

        actionArray.push(actionCoordinate);
    }
    condition.coordinate = conditionArray;
    condition.action = actionArray;
    
    json.condition = condition;

   // console.log(condition);
    downloadJSON(json, 'condition');


}

function cutCoordinate(coords,rect) {
    if(relativeCoord(rect.aCoords).xmin<0) {
        coords.xmin=0;
    }
    else if(relativeCoord(rect.aCoords).xmin>1){
        coords.xmin=1;
    }
    else {
        coords.xmin = relativeCoord(rect.aCoords).xmin;
    }


    if(relativeCoord(rect.aCoords).ymin<0) {
        coords.ymin=0;
    }
    else if(relativeCoord(rect.aCoords).ymin>1){
        coords.ymin=1;
    }
    else {
        coords.ymin = relativeCoord(rect.aCoords).ymin;
    }
    
    if(relativeCoord(rect.aCoords).xmax<0) {
        coords.xmax=0;
    }
    else if(relativeCoord(rect.aCoords).xmax>1){
        coords.xmax=1;
    }
    else {
        coords.xmax = relativeCoord(rect.aCoords).xmax;
    }
    
    if(relativeCoord(rect.aCoords).ymax<0) {
        coords.ymax=0;
    }
    else if(relativeCoord(rect.aCoords).ymax>1){
        coords.ymax=1;
    }
    else {
        coords.ymax = relativeCoord(rect.aCoords).ymax;
    }

    return coords;
}
function downloadJSON(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
//TODO min Section2

function makeXML() {
    var canvas = document.getElementById("canvas").fabric;
  //  var invisibleCanvas = document.getElementById("invisibleCanvas").fabric;
    var file=document.getElementById('uploader').files;
    var sourceImage=new Image();
    sourceImage.src=$("#uploader").attr('src');
    filename = document.getElementById('filename').innerHTML;
    var rects=canvas.getObjects('rect');
    var conditionRect=[];
    var numRect=0;
    for(var i=0;i<rects.length;i++) {
        if(rects[i].stroke=='red') {
            conditionRect.push(rects[numRect])
            numRect++;
        }
    }
    var doc = document.implementation.createDocument("", "", null);
    var annotation = doc.createElement("annotation");

    var annotation1 = doc.createElement("folder");
    var annotation1Text = doc.createTextNode("condition");
    annotation1.appendChild(annotation1Text);

    var annotation2 = doc.createElement("filename");
    var annotation2Text = doc.createTextNode(filename);
    annotation2.appendChild(annotation2Text);


    var annotation3= doc.createElement("path");
    var annotation3Text =  doc.createTextNode(".");
    annotation3.appendChild(annotation3Text);

    var annotation4= doc.createElement("source");

    var source = doc.createElement("database");
    var sourceText = doc.createTextNode("unknown");
    source.appendChild(sourceText);
    annotation4.appendChild(source);

    var annotation5 = doc.createElement("size");
    var width = doc.createElement("width");
    var widthText = doc.createTextNode(sourceImage.width);
    width.appendChild(widthText);

    var height = doc.createElement("height");
    var heightText = doc.createTextNode(sourceImage.height);
    height.appendChild(heightText);

    var depth = doc.createElement("depth");
    var depthText= doc.createTextNode("3");
    depth.appendChild(depthText);

    annotation5.appendChild(width);
    annotation5.appendChild(height);
    annotation5.appendChild(depth);

    var annotation6 = doc.createElement("segmented");
    var annotation6Text = doc.createTextNode("0");
    annotation6.appendChild(annotation6Text);

    var annotation7 = doc.createElement("object");

    var name = doc.createElement("name");
    var nameText = doc.createTextNode("condition");
    name.appendChild(nameText);

    var pose = doc.createElement("pose");
    var poseText = doc.createTextNode("unspecified");
    pose.appendChild(poseText);

    var truncated = doc.createElement("truncated");
    var truncatedText = doc.createTextNode("0");
    truncated.appendChild(truncatedText);

    var difficult = doc.createElement("difficult");
    var difficultText = doc.createTextNode("0");
    difficult.appendChild(difficultText);
    var bndbox=[];
    for(var i=0;i<numRect;i++) {
        var bndboxEl=doc.createElement("bndbox");
        var xmin = doc.createElement("xmin");
        var ymin = doc.createElement("ymin");
        var xmax = doc.createElement("xmax");
        var ymax = doc.createElement("ymax");
        var xminText = doc.createTextNode(sourceImage.width*relativeCoord(conditionRect[i].aCoords).xmin);
        var yminText = doc.createTextNode(sourceImage.height*relativeCoord(conditionRect[i].aCoords).ymin);
        var xmaxText = doc.createTextNode(sourceImage.width*relativeCoord(conditionRect[i].aCoords).xmax);
        var ymaxText = doc.createTextNode(sourceImage.height*relativeCoord(conditionRect[i].aCoords).ymax);
        xmin.appendChild(xminText);
        ymin.appendChild(yminText);
        xmax.appendChild(xmaxText);
        ymax.appendChild(ymaxText);
        bndboxEl.appendChild(xmin);
        bndboxEl.appendChild(ymin);
        bndboxEl.appendChild(xmax);
        bndboxEl.appendChild(ymax);
        bndbox.push(bndboxEl);
    }
    //console.log(bndbox[0]);
   // console.log(bndbox[1]);
    annotation7.appendChild(name);
    annotation7.appendChild(pose);
    annotation7.appendChild(truncated);
    annotation7.appendChild(difficult);
    
    for(i=0;i<numRect;i++) {       
        annotation7.appendChild(bndbox[i]);
    }

    annotation.appendChild(annotation1);
    annotation.appendChild(annotation2);
    annotation.appendChild(annotation3);
    annotation.appendChild(annotation4);
    annotation.appendChild(annotation5);
    annotation.appendChild(annotation6);
    annotation.appendChild(annotation7);

    doc.appendChild(annotation);
   // console.log(doc)
    return doc;
}
/* function toXML() {
    var xml = "<annotation><folder></folder><filename></filename><path></path><source><database></database></source><size><width></width><height></height><depth></depth></size><segmented></segmented><object><name></name><pose></pose><truncated></truncated><difficult></difficult><bndbox><xmin></xmin><ymin></ymin><xmax></xmax><ymax></ymax></bndbox></object></annotation>"
  xmlDoc = $.parseXML( xml ),
  $xml = $( xmlDoc ),
  $title = $xml.find( "title" );
 
} */


/* function erase(){
    document.getElementById("gridcheckbox").onchange = function () {
        drawingMode = this.checked ? "delete" : "add";
    console.warn(drawingMode);
    };
} */



function documentToString(document) {
    var serializer = new XMLSerializer();
    //console.log(serializer.serializeToString(document));
    return serializer.serializeToString(document);
}

function downloadXML(string){
    var blob = new Blob([string], {type: "text/xml"});
    var a = document.createElement('a');
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = 'document.xml';
    a.click();
}

function XML(){
    var XML=makeXML();
    XML=documentToString(XML);
    downloadXML(XML);
}

function downloadAll(){
    if(!isfile()) {
        return;
    }
    makeJSON();
    XML();
}

function isfile() {
    var file=document.getElementById('uploader').files;
    if($('#uploader').attr('src')==null) {
        alert("이미지가 없습니다.");
        return false;
    }
    else {
        return true;
    }

}

function issquare() {
    var canvas = document.getElementById("canvas").fabric;
    var rects=canvas.getObjects('rect');
    var conditionNum = 0;
    var actionNum = 0;
    for(var i in rects) {
        if (rects[i].stroke=='red') {
            conditionNum++;
        }

        else if(rects[i].stroke=='blue') {
            actionNum++;
        }

        else {
            continue;
        }
    }

    if(conditionNum == 0) {
        alert("condition이 없습니다.");
        return false;
    }
   else if(actionNum == 0) {
        alert("action이 없습니다.");
        return false;
    }
    else {
        return true;
    }
}


function gridIconChange(){
    var checkbox = $('#gridCheckbox');

    
    checkbox.on('click', function() {
        if(isCheck()){
            document.getElementById('gridButton').innerHTML='grid_off'
        }
        else{
            document.getElementById('gridButton').innerHTML='grid_on'
        }
    })
}

function filename(){
    $("#uploader").on("change",function(e){
        var file=document.getElementById('uploader').files;
        if(file.length!=0){
            console.log(file);
            document.getElementById('filename').innerHTML='filename : '+file[0].name;
        }
    });

}

function downloadButton(){
    $("#uploader").on("change",function(e){
        var file=document.getElementById('uploader').files;
        if(file!==null){
            $('.downloadButton').css('visibility','visible');
        }

        else{
            $('.downloadButton').css('visibility','hidden');
        }
        
    });
}


/* function drawColor(){
    $("#drawColor").on(change,function(e){
        $('.drawColor').css('color', $("#drawColor option:selected").val())
        $('.drawColor').css('background-color',$("#drawColor option:selected").val())
    })
} */

function download() {
    var canvas = document.getElementById("canvas").fabric;
    var fill=true;
    var obj=canvas.getObjects('rect');
    for(var i in obj) {
        if(obj[i].fill=='') {
            fill=false;
            break;
        }
    }
    if(!fill){
        downloadAll();
    }

    else if(fill){
        downloadImg();
    }

    else{
        console.err('downloadError');
    }
}

function color(){
    $('.drawColor option').each(function() {
        $(this).css('background-color', $(this).val());
        if($(this).css('background-color')=='rgb(0, 0, 0)'){
            $(this).css('color','white');
        }

        else{
            $(this).css('color','black');
        }
    });
  
    $('.drawColor').on('change', function() {
        $(this).css('background-color', $(this).val());

        if($(this).css('background-color')=='rgb(0, 0, 0)'){
            $(this).css('color','white');
        }

        else{
            $(this).css('color','black');
        }
    });
}