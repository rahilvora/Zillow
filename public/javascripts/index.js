/**
 * Created by rahilvora on 2/24/18.
 */

$(document).ready(()=>{
    let x2js = new X2JS();
    let responseTable = $("#responseTable");
    $("#addressForm").submit((event)=> {
        event.preventDefault();
        handleSubmit(event)
    });
    let generateResultTable = (data) => {
        let jsonResponse = x2js.xml_str2json(data).searchresults;
        let responseBody = $('#responseBody');
        let serverResponse = $('#serverResponse');
        serverResponse.text("");
        if(jsonResponse.message.code === "0"){
            let resultHtmlString = "";
            let results = jsonResponse.response.results.result
            for(let result in results){
                let tableRow = "<tr>";
                let resultRow = results[result];
                for(let r in resultRow){
                    let tableData = "";
                    switch (r) {
                        case 'address':{
                            tableData += "<td>" +resultRow[r].street + ", "
                                + resultRow[r].city + ", "
                                + resultRow[r].city + ", "
                                + resultRow[r].zipcode + "</td> "+
                                "<td>" +
                                resultRow[r].latitude +"/"+resultRow[r].longitude+
                                "</td>"
                            break;
                        }
                        case 'links':{
                            tableData += "<td>" +
                                "<p> homedetails " + resultRow[r].homedetails + "</p>" +
                                "<p> mapthishome " + resultRow[r].mapthishome + "</p>" +
                                "<p> comparables " + resultRow[r].comparables + "</p>" +
                                "</td>";
                            break;
                        }
                        case 'zestimate':{
                            tableData += "<td> Currency:"+ resultRow[r].amount['_currency'] + " " + ((resultRow[r].amount['#text']) || "-") + "</td>"+
                                "<td>"+ resultRow[r]['last-updated']+ "</td>"+
                                "<td> Duration: "+ (resultRow[r]['@duration'] || "-") + "Currency: "+(resultRow[r]['_currency'] || "-")+" " + (resultRow[r]['#text']||"-    ")+"</td>"+
                                "<td> <p>low:" + (resultRow[r]['valuationRange']['low']['_currency']||"-") + " " + (resultRow[r]['valuationRange']['low']['#text']||"-")+ "</p>"+
                                "<p> High:" + (resultRow[r]['valuationRange']['high']['_currency']||"-") + " " +(resultRow[r]['valuationRange']['high']['#text']||"-")+"</p></td>"+
                                "<td>"+ (resultRow[r]['percentile']||"-") +"</td>"


                            break;
                        }
                        case 'localRealEstate':{
                            tableData += "<td> <p> name: " + resultRow[r]['region']['_name'] +"</p>"+
                                "<p> id: "+ resultRow[r]['region']['_id'] +"</p>"+
                                "<p> ZIndexValue: "+ resultRow[r]['region']['zindexValue'] +"</p></td>";
                            break;
                        }
                        default:{
                            tableData += "<td>" + resultRow[r] + "</td>";
                        }
                    }
                    tableRow += tableData;
                }
                tableRow += "</tr>"
                resultHtmlString += tableRow;
            }
            responseBody.append(resultHtmlString);
            responseTable.show();
        } else {
            let serverResponse = $('#serverResponse');
            serverResponse.text("Server Response: " + jsonResponse.message.text);
        }

    }

    let handleSubmit = (e) => {
        const address = $("#address").val();
        const city = $("#city").val();
        const state = $("#state").val();
        const zipCode= $("#zipcode").val();
        $.post("/getHouses", {address, city, state, zipCode})
            .done((response)=> {
                generateResultTable(response.data);
            }).fail((error) => {
            let serverResponse = $('#serverResponse');
            serverResponse.text("Server Response: " + error.status+ " - " + error.statusText);
        });

    }
});
