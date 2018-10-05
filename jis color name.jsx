
// 新規ドキュメント
preferences.rulerUnits = Units.POINTS;
app.documents.add(3508,7440);

// csvファイルを読み込み
var filepath = prompt("csvファイルのパスを入力してください","/");
var colorNameArray = convertCSVtoArray(filepath);
var colorNameAreaArray = [
    '01_赤'
    ,'02_黄赤'
    ,'03_黄'
    ,'04_黄緑'
    ,'05_緑'
    ,'06_青緑'
    ,'07_青'
    ,'08_青紫'
    ,'09_紫'
    ,'10_赤紫'
    ,'11_無彩色'
];

for (var j=0; j < colorNameAreaArray.length; j++) {
    // レイヤーグループを作成
    laySetObj = activeDocument.layerSets.add();
    laySetObj.name = colorNameAreaArray[j];

    // JIS系統色名の基本色名ごとに、エリア分けする
    width = 1754;
    height = 1240;
    offset = 5;
    if ((j % 2) == 0) {
        // 左列の場合
        x = 0;
        y = 0 + (height * j * 0.5);
    } else {
        // 右列の場合
        x = width;
        y = 0 + (height * (j -1) * 0.5);
    }
    x1 = x;
    y1 = y;
    x2 = x;
    y2 = y + height;
    x3 = x + width;
    y3 = y + height;
    x4 = x + width;
    y4 = y;
    DrawShape([x1, y1], [x2, y2], [x3, y3], [x4, y4], 0,0,0);
    laySetObj.artLayers[0].name = colorNameAreaArray[j] + '_frame';
    DrawShape([x1+offset, y1+offset], [x2+offset, y2-offset], [x3-offset, y3-offset], [x4-offset, y4+offset], 255,255,255);
    laySetObj.artLayers[0].name = colorNameAreaArray[j] + '_area';
    // テキストレイヤー追加
    layObj = laySetObj.artLayers.add();
    layObj.kind = LayerKind.TEXT;
    layObj.textItem.contents = colorNameAreaArray[j];
    layObj.textItem.size = 60;
    layObj.textItem.font = 'Meiryo';
    layObj.textItem.justification = Justification.LEFT;
    layObj.textItem.color.rgb.red = 0;
    layObj.textItem.color.rgb.green = 0;
    layObj.textItem.color.rgb.blue = 0;
    translateLayerAbsolutePosition(layObj, x+40, y+15);

    // JIS慣用色名(color name)のシェイプを描画
    cn_width = 150;
    cn_height = 150;
    cn_x = x + 40;
    cn_y = y + 100;
    cn_cnt = 0;
    for (var k=0; k < colorNameArray.length; k++) {
        cn_x1 = cn_x;
        cn_y1 = cn_y;
        cn_x2 = cn_x;
        cn_y2 = cn_y + cn_height;
        cn_x3 = cn_x + cn_width;
        cn_y3 = cn_y + cn_height;
        cn_x4 = cn_x + cn_width;
        cn_y4 = cn_y;
        if (colorNameArray[k][0] -1 == j) {
            // シェイプ描画
            DrawShape([cn_x1, cn_y1], [cn_x2, cn_y2], [cn_x3, cn_y3], [cn_x4, cn_y4], colorNameArray[k][9],colorNameArray[k][10],colorNameArray[k][11]);
            laySetObj.artLayers[0].name = '('+colorNameArray[k][2]+')'+colorNameArray[k][3]+'.png';
            // テキストレイヤー追加
            var CR = String.fromCharCode(13);
            layObj = laySetObj.artLayers.add();
            layObj.kind = LayerKind.TEXT;
            layObj.textItem.contents = '('+colorNameArray[k][2]+')'+CR
            +colorNameArray[k][3]+CR
            +colorNameArray[k][4]+CR
            +colorNameArray[k][5]+CR
            +colorNameArray[k][7]+CR
            +'#'+colorNameArray[k][8]+CR
            +'R:'+colorNameArray[k][9]
            +' G:'+colorNameArray[k][10]
            +' B:'+colorNameArray[k][11]+CR
            +'C:'+colorNameArray[k][12]
            +'M:'+colorNameArray[k][13]
            +'Y:'+colorNameArray[k][14]
            +'K:'+colorNameArray[k][15];
            layObj.textItem.size = 15;
            layObj.textItem.useAutoLeading = false;
            layObj.textItem.leading = 19;
            layObj.textItem.font = 'Meiryo';
            layObj.textItem.justification = Justification.LEFT;
            layObj.textItem.color.rgb.red = 0;
            layObj.textItem.color.rgb.green = 0;
            layObj.textItem.color.rgb.blue = 0;
            translateLayerAbsolutePosition(layObj, cn_x1+155, cn_y1);
            // 位置をずらす
            if ((cn_cnt)%5 == 4) {
                // 行の折り返しの場合
                cn_x = x + 40;
                cn_y = cn_y + 180;
            } else {
                cn_x = cn_x + 335;
            }
            cn_cnt++;
        }
    }
}

// https://gist.github.com/vladocar/1307987
function DrawShape(crd1, crd2, crd3, crd4, red, green, blue) {
    var doc = app.activeDocument;

    var lineArray = [];
    for (var i=0; i < 4; i++) {
        lineArray[i] = new PathPointInfo;
        lineArray[i].kind = PointKind.CORNERPOINT;
        lineArray[i].anchor = arguments[i];
        lineArray[i].leftDirection = lineArray[i].anchor;
        lineArray[i].rightDirection = lineArray[i].anchor;
    }

    var lineSubPathArray = new SubPathInfo();
    lineSubPathArray.closed = true;
    lineSubPathArray.operation = ShapeOperation.SHAPEADD;
    lineSubPathArray.entireSubPath = lineArray;
    var myPathItem = doc.pathItems.add("myPath", [lineSubPathArray]);

    var desc88 = new ActionDescriptor();
    var ref60 = new ActionReference();
    ref60.putClass(stringIDToTypeID("contentLayer"));
    desc88.putReference(charIDToTypeID("null"), ref60);
    var desc89 = new ActionDescriptor();
    var desc90 = new ActionDescriptor();
    var desc91 = new ActionDescriptor();
    desc91.putDouble(charIDToTypeID("Rd  "), red); // R
    desc91.putDouble(charIDToTypeID("Grn "), green); // G
    desc91.putDouble(charIDToTypeID("Bl  "), blue); // B
    var id481 = charIDToTypeID("RGBC");
    desc90.putObject(charIDToTypeID("Clr "), id481, desc91);
    desc89.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), desc90);
    desc88.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), desc89);
    executeAction(charIDToTypeID("Mk  "), desc88, DialogModes.NO);

    myPathItem.remove();
}

function translateLayerAbsolutePosition (layObj, moveX, moveY) {
    var targetLayer = layObj;
    targetLayerBounds = targetLayer.bounds;
    resetX = parseInt(targetLayerBounds[0]) * -1;
    resetY = parseInt(targetLayerBounds[1]) * -1;
    targetLayer.translate(resetX , resetY);
    targetLayer.translate(moveX, moveY);
}

function convertCSVtoArray(filepath){
    // パス指定
    var fileObj = new File(filepath);
    var isSuccess = fileObj.open('r');

    // 配列に格納する
    if (isSuccess) {
        var retArray = [];
        var row_cnt = 0; // 行番号
        do {
            row = fileObj.readln(); // 1行分読み込み
            comma = row.indexOf(',');
            if (comma >= 0) { // カンマがある場合のみ処理
                csvValueCells = row.split(',');
                if (row_cnt != 0) { // 最初の行は不要なので格納しない
                    key = row_cnt - 1;
                    retArray[key] = [];
                    for (var i=0; i < csvValueCells.length; i++) {
                        retArray[key][i] = csvValueCells[i]; // 配列に格納する
                    }
                }
            }
            row_cnt++;
        } while (comma >= 0);
        fileObj.close();
    }

    return retArray;
}
