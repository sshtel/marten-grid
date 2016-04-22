/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function getHtmlHeadCode(tableData){
    var buffer = [];
    buffer.push("<head>\n");
    buffer.push("<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>\n");
    buffer.push("<link rel='stylesheet' type='text/css' href='" + tableData.gridParams.styleUri + "'>\n");
    buffer.push("</head>\n");
    return buffer.join("");
}
function getHeaderCode(tableData) {
    if(!tableData) return null;
    var headerData = tableData.header;
    var buffer = [];
    var trLine = "<tr class='" + headerData.style + "' >\n";
    buffer.push(trLine);

    var idx = 0;
    $.each(headerData.val, function (index, value) {
        var colData = headerData.colModel;
        buffer.push("\t<td ");
        buffer.push(" width=" + colData[idx.toString()].width);
        buffer.push(" class='" + headerData.style + "'");
        buffer.push(" >");
        buffer.push(value);
        buffer.push("\t</td>\n");
        idx++;
    });
    buffer.push("</tr>\n");
    return buffer.join("");
}

function getRowsCode(tableData){
//        console.log("call getGridRows");
//        console.log(rowsData);
    if(!tableData) { return null; }
    var headerData = tableData.header;
    var rowData = tableData.rowData;
    var colModel = headerData.colModel;
    var buffer = [];
    var rowDataNum = 0;
    $.each(rowData.val, function (index, row){
//            console.log("row: " + row);
        buffer.push("<tr>\n");
        var idx = 0;
        $.each(row, function(index, value){
            
            buffer.push("\t<td ");
            
            //for colModel
            var myColModel = colModel[idx.toString()];
            
            if(!myColModel.hasOwnProperty('class')){
                buffer.push('class' + "='" + tableData.gridParams.style.rows + "' ");
            }
            
            for(var attr in myColModel ){
                if(attr === 'class'){
                    buffer.push(" class='" + myColModel['class'] + "' ");
                }
                else { buffer.push(attr + "='" + myColModel[attr] + "' "); }
            }
            
            buffer.push(" >");
            buffer.push(value);
            buffer.push("\t</td>\n");
            idx++;
        });
        buffer.push("</tr>\n");
        rowDataNum++;
    });
    var rowNum = tableData.gridParams.rowNum;
    var colNum = tableData.gridParams.colNames.length;

    //check row numbers
    if(rowDataNum < rowNum){
        for(var i = 0; i< rowNum - rowDataNum; ++i){
            buffer.push("<tr>\n");
            for(var j = 0; j < colNum; ++j){
                buffer.push("\t<td ");
                buffer.push(" width=" + colModel[j.toString()].width);
                buffer.push(" class='" + rowData.style + "'");
                buffer.push(" >");
                buffer.push("&nbsp;");
                buffer.push("\t</td>\n");
            }
            buffer.push("</tr>\n");
        }
    }

    return buffer.join("");
}

function tableManager(){

    var tableData = {
        gridParams: {},
        title: {
            style: "mt-Title",
            data: "Marten Grid"
        },
        header: {
            style: "mt-Header",
            val: [],
            colModel: {}
        },
        rowData: {
            style: "mt-Rows",
            val: { }
        }
    };

    this.init = function(_gridParams){
        tableData.gridParams = _gridParams;
        
        tableData.header.val = _gridParams.colNames;
        tableData.header.colModel = _gridParams.colModel;
    }
    
    //for RowData
    this.setRowData = function(rowData) {
        tableData.rowData.val = rowData;
    }
    this.addRowData = function(data){        }

    this.out = function () {
        var buffer = [];
        var gridParams = tableData.gridParams;
        buffer.push(getHtmlHeadCode(tableData));
        buffer.push("<table");
        buffer.push(" width='" + gridParams.tableSize.width + "'");
        buffer.push(" height='" + gridParams.tableSize.height + "'");
        buffer.push(" class='" + gridParams.style.table + "'>\n");
        buffer.push(  getHeaderCode(tableData));
        buffer.push(  getRowsCode(tableData));
        buffer.push("</table>\n");
        return buffer.join("");
    }
}

(function ($) {
    $.fn.martenGrid = function (gridParams) {
//            this.css("color", "red");
        var table = new tableManager();
        table.init(gridParams);
        
        var rows ="";
        $.ajax({
            url: "rows.jsp",
            type: "post",
            dataType: "json",
            async: false,
            success: function(result){
                rows = result;
//                    console.log("result: ", result);
            },
            error : function(a, b, c){
                console.log(a, b, c);
            }
        });

        table.setRowData(rows);

        console.log(table.out());
        document.write(table.out());

        return this;
    };
}(jQuery));
