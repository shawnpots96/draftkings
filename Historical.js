$(document).ready(function(){
	alert("I am inside .ready sHAWN");
	LoadList("QB");
});
function LoadList (Indicator) {
	
	//Remove existing List options
	var x = document.getElementById("List");
	while (x.length > 0) {x.remove(x.length-1);}

	alert("List dropdown is empty");

	$.post("Load.php",
	{
		name: "Donald Duck",
		city: "Duckburg"
	},
	function(data, status){
		alert("Data: " + data + "\nStatus: " + status);
	});

    
    	//Get Position player list into dropdown
	$.post(
		'Load.php',
		{postPosition: Indicator},
		function(data){
			alert("I am in .post");
			PlayerList = JSON.parse(data);
			for (i=0; i < PlayerList.length; i++) {
				alert("Adding to List");
				var option = document.createElement("option");
				option.text = PlayerList[i];
				document.getElementById("List").add(option);
			}
		}
	)
	alert("Outside post");
	main(50,null)
}
function main (normal,updateShowData) {
	alert("Inside Main");
	Dashboard (normal,updateShowData);
	Projection ();
}
function Projection () {
	var Player = $("#List :selected").text();
	if (Player == null || Player == "" ) {Player = "Brady, Tom";}
	var arr = [], ExpectedData = [], Xlabels = [], Query = [];
	
	//Get data from server and draw chart
	$.post(
		'../PHP/Matchup.php',
		{postPlayer: Player},
		function(data){
			var firstRun = 1;
			data = data.split('_');
			for (var i in data) {
				if (data[i].length > 0){
					if (firstRun == 1) {
						var HomeAway = data[0];
						firstRun = 2;
					}
					else if (firstRun == 2) {
						var DVOAPASS = data[i];
						firstRun = 3;
					}
					else if (firstRun == 3) {
						var DVOARUSH = data[i];
						firstRun = 4;
					}
					else if (firstRun == 4) {
						var DVOAWR1 = data[i];
						firstRun = 5;
					}
					else if (firstRun == 5) {
						var DVOATE = data[i];
						firstRun = 6;
					}
					else if (firstRun == 6) {
						var DVOARB = data[i];
						firstRun = 7;
					}
					else if (firstRun == 7) {
						var Division = data[i];
						firstRun = 8;
					}
					else if (firstRun == 8) {
						var Favorite = data[i];
						firstRun = 9;
					}
					else if (firstRun == 9) {
						var Spread = data[i];
						firstRun = 10;
					}
					else if (firstRun == 10) {
						var Position = data[i];
						firstRun = 1;
					}
				}
			}
			$.post(
				'../PHP/Projection.php',
				{postPosition: Position, postHomeAway: HomeAway, postDVOAPASS: DVOAPASS, postDivision: Division, postFavorite: Favorite, postSpread: Spread},
				function(data1){
					var firstRun = 1;
					data1 = data1.split('_');
					for (var i in data1) {
						if (data1[i].length > 0){
							if (firstRun == 1) {
								arr.push(parseFloat(data1[i]));
								firstRun = 2;
							}
							else if (firstRun == 2) {
								var Avg = data1[i];
								firstRun = 3;
							}
							else if (firstRun == 3) {
								var SD = data1[i];
								firstRun = 1;
							}
						}
					}
					var SDM25 = 0, SDM20 = 0, SDM15 = 0, SDM10 = 0, SDM05 = 0, SDM00 = 0, SDP05 = 0, SDP10 = 0, SDP15 = 0, SDP20 = 0, SDP25 = 0, SDP30 = 0;
					
					for (i=0; i < arr.length; i++) {
						if (arr[i] <= (parseInt(Avg) - parseInt((2.5*SD)))) {SDM25 += 1;}
						else if (arr[i] <= (parseInt(Avg) - parseInt((2*SD)))) {SDM20 += 1;}
						else if (arr[i] <= (parseInt(Avg) - parseInt((1.5*SD)))) {SDM15 += 1;}
						else if (arr[i] <= (parseInt(Avg) - parseInt((1*SD)))) {SDM10 += 1;}
						else if (arr[i] <= (parseInt(Avg) - parseInt((0.5*SD)))) {SDM05 += 1;}
						else if (arr[i] <= (parseInt(Avg) + parseInt((0*SD)))) {SDM00 += 1;}
						else if (arr[i] <= (parseInt(Avg) + parseInt((0.5*SD)))) {SDP05 += 1;}
						else if (arr[i] <= (parseInt(Avg) + parseInt((1*SD)))) {SDP10 += 1;}
						else if (arr[i] <= (parseInt(Avg) + parseInt((1.5*SD)))) {SDP15 += 1;}
						else if (arr[i] <= (parseInt(Avg) + parseInt((2*SD)))) {SDP20 += 1;}
						else if (arr[i] <= (parseInt(Avg) + parseInt((2.5*SD)))) {SDP25 += 1;}
						else {SDP30 += 1;}
					}
					
					ExpectedData.push(SDM25,SDM20,SDM15,SDM10,SDM05,SDM00,SDP05,SDP10,SDP15,SDP20,SDP25,SDP30);
					
					if (HomeAway == 'H') {
						HomeAway = 'Home';
					}
					else {
						HomeAway = 'Away';
					}
					if (Division == 1) {
						Division = 'divisional';
					}
					else {
						Division = 'non-divisional';
					}
					if (Favorite == 1) {
						Favorite = 'Favorite';
					}
					else {
						Favorite = 'underdog';
					}
					
					Query.push(Position, HomeAway, DVOAPASS, Division, Favorite, Spread);

					var plotLines = [{
					    "value": 0,
				        "width": 2,
				        "color": "#666",
				        "zIndex": 10,
				        "dashStyle": "Dash",
				        "label": {
					        "text": "avg",
					            "rotation": 0,
					            "align": "center",
					            "x": 0,
					            "y": -5,
					            "style": {
					            "fontSize": "10px"
					            }
					    	}
						}, {
					    "value": -1,
				        "width": 1,
				        "color": "#999",
				        "dashStyle": "Dash",
				        "zIndex": 10,
				        "label": {
					        "text": "-1sd",
					            "rotation": 0,
					            "align": "center",
					            "x": 0,
					            "y": -5,
					            "style": {
					            "fontSize": "10px"
					            }
				        	}
						}, {
					    "value": 1,
				        "width": 1,
				        "color": "#999",
				        "dashStyle": "Dash",
				        "zIndex": 10,
				        "label": {
					        "text": "+1sd",
					            "rotation": 0,
					            "align": "center",
					            "x": 0,
					            "y": -5,
					            "style": {
					            "fontSize": "10px"
					            }
					    	}
						}, {
					    "value": -2,
				        "width": 1,
				        "color": "#999",
				        "dashStyle": "Dash",
				        "zIndex": 10,
				        "label": {
					        "text": "-2sd",
					            "rotation": 0,
					            "align": "center",
					            "x": 0,
					            "y": -5,
					            "style": {
					            "fontSize": "10px"
					            }
					    	}
						}, {
					    "value": 2,
				        "width": 1,
				        "color": "#999",
				        "dashStyle": "Dash",
				        "zIndex": 10,
				        "label": {
					        "text": "+2sd",
					            "rotation": 0,
					            "align": "center",
					            "x": 0,
					            "y": -5,
					            "style": {
					            "fontSize": "10px"
					            }
					    	}
						}, {
					    "value": -3,
				        "width": 1,
				        "color": "#999",
				        "dashStyle": "Dash",
				        "zIndex": 10,
				        "label": {
					        "text": "-3sd",
					            "rotation": 0,
					            "align": "center",
					            "x": 0,
					            "y": -5,
					            "style": {
					            "fontSize": "10px"
					            }
					    	}
						}, {
					    "value": 3,
				        "width": 1,
				        "color": "#999",
				        "dashStyle": "Dash",
				        "zIndex": 10,
				        "label": {
					        "text": "+3sd",
					            "rotation": 0,
					            "align": "center",
					            "x": 0,
					            "y": -5,
					            "style": {
					            "fontSize": "10px"
					            }
					    	}
						}];
					var plotBands = [{"from": -1,"to": 1,"zIndex": 0},{"from": -2,"to": 2,"zIndex": 0},{"from": -3,"to": 3,"zIndex": 0}];
					
					options=RunOptions("Distribution",Query,plotLines,ExpectedData,Position,plotBands);
					new Highcharts.Chart(options);
				}
			);
		}
	);
}
function Dashboard (normal,updateShowData) {
	var Player = $("#List :selected").text();
	if (Player == null || Player == "" ) {Player = "Brady, Tom";}
	
	var arr1 = [], arr2 = [], arr3 = [], arr4 = [], arr5 = []; //arrays to catch return php data
	var ActPtsData = [], SalaryData = [], Avg = [], SD = [], ExpectedData = []; //Arrays that appear in highcharts options
	var Position, Team;
	
	if (normal == null) {normal = $("#slider").slider("value");} //If normal is null, then used value=50
	
	if (updateShowData !== null) {ShowData=updateShowData} //Update ShowData only if it comes from Export buttons
	
	// Set Normal values based on https://www.mathsisfun.com/data/standard-normal-distribution-table.html
	if (normal == 0) {slider=-3.09;}
	else if (normal == 5) {slider=-1.645;}
	else if (normal == 10) {slider=-1.28;}
	else if (normal == 15) {slider=-1.04;}
	else if (normal == 20) {slider=-0.84;}
	else if (normal == 25) {slider=-0.67;}
	else if (normal == 30) {slider=-0.52;}
	else if (normal == 35) {slider=-0.39;}
	else if (normal == 40) {slider=-0.25;}
	else if (normal == 45) {slider=-0.13;}
	else if (normal == 50) {slider=0;}
	else if (normal == 55) {slider=0.13;}
	else if (normal == 60) {slider=0.25;}
	else if (normal == 65) {slider=0.39;}
	else if (normal == 70) {slider=0.52;}
	else if (normal == 75) {slider=0.67;}
	else if (normal == 80) {slider=0.84;}
	else if (normal == 85) {slider=1.04;}
	else if (normal == 90) {slider=1.28;}
	else if (normal == 95) {slider=1.645;}
	else if (normal == 100) {slider=3.09;}

	//Get data from server and draw chart
	$.post(
		'../PHP/DKdata.php',
		{postPlayer: Player},
		function(data){
			var firstRun = 1;
	    	data = data.split('_');
			for (var i in data) {
				if (data[i].length > 0){
					if (firstRun == 1) {
						arr1.push(data[i]);
						firstRun = 2;
					}
					else if (firstRun == 2) {
						arr2.push(parseFloat(data[i]));
						firstRun = 3;
					}
					else if (firstRun == 3) {
						arr3.push(parseFloat(data[i]));
						firstRun = 4;
					}
					else if (firstRun == 4) {
						arr4.push(parseFloat(data[i]));
						firstRun = 5;
					}
					else if (firstRun == 5) {
						arr5.push(parseFloat(data[i]));
						firstRun = 6;
					}
					else if (firstRun == 6) {
						Position = data[i];
						firstRun = 7;
					}
					else if (firstRun == 7) {
						Team = data[i];
						firstRun = 1;
					}
				}
			}
			
			//Remove last data points based on user selection
			var Xlabels = arr1.slice(-ShowData);
			var ActPtsData = arr2.slice(-ShowData);
			var SalaryData = arr3.slice(-ShowData);
			var Avg = arr4.slice(-ShowData);
			var SD = arr5.slice(-ShowData);
			
			//Calculate +/- based on normal distribution
			for (i=0; i < ActPtsData.length; i++) {ExpectedData.push(ActPtsData[i] - (Avg[i]+(slider*SD[i])));}
			
			//Run options and draw chart
			options=RunOptions("Dashboard",SalaryData,Xlabels,ExpectedData);
			
			//Average points
			var sum = 0;
			var avg;
			for (i=0; i < ActPtsData.length; i++) {
				sum += ActPtsData[i];
			}
			var avg = sum/ActPtsData.length;
			
			//Consistency
			var sum = 0;
			var cons;
			for (i=0; i < ExpectedData.length; i++) {
				if (ExpectedData[i] >= 0) {
					sum += 1;
				};
			}
			var cons = (sum/ActPtsData.length)*100;
			
			//Salary change
			var SalChg = SalaryData[SalaryData.length-1] - SalaryData[0];
			
			//textboxes in bottom left and right
			options.chart.events = {
		      load: function() {
		    	  var x=65; //determines vertical alignment for Bottom textboxes
		    	  var y=20; //determines vertical alignment for Top textboxes
		    	  var chart = this;
		    	  chart.renderer.text('Click an indicator for details', 10, x-25)
		    	  	.css({fontSize: '15px',color: '#666666'})
		            .add();
		    	  chart.renderer.text('Avg Pts<br>'+avg.toFixed(1), 10, x)
		    	  	.css({fontSize: '20px',color: '#666666'})
			        .on('click', function() {Indicators("AvgPts")})
		            .add();
		    	  if (cons < 50) {
		    		  chart.renderer.text('Consistency<br><span style="color: red">'+cons.toFixed(0)+'%</span>', 100, x)
		    		  	.css({fontSize: '20px',color: '#666666'})
		    		  	.on('click', function() {Indicators("Const")})
			            .add();
		    	  }
		    	  else {
		    		  chart.renderer.text('Consistency<br><span style="color: green">'+cons.toFixed(0)+'%</span>', 100, x)
		    		  	.css({fontSize: '20px',color: '#666666'})
		    		  	.on('click', function() {Indicators("Const")})
			            .add();
		    	  }
			      if (SalChg < 0) {
			    	  chart.renderer.text('Salary Change<br><span style="color: red">'+SalChg.toFixed(0)+'$</span>', 240, x)
			    	  	.css({fontSize: '20px',color: '#666666'})
			    	  	.on('click', function() {Indicators("SalChg")})
			            .add();
			      }
			      else {
			    	  chart.renderer.text('Salary Change<br><span style="color: green">'+SalChg.toFixed(0)+'$</span>', 240, x)
			    	  	.css({fontSize: '20px',color: '#666666'})
			    	  	.on('click', function() {Indicators("SalChg")})
			            .add();
			      }
			      chart.renderer.text(Player+' | '+Position+' | '+Team+' | ', 10, y)
			      	.css({fontSize: '20px',color: '#666666'})
		    	  	.add();
		      }
			}
			new Highcharts.Chart(options);
		}
	);
}

function RunOptions (ChartType,SalaryData,Xlabels,ExpectedData,position,plotBands) {
	switch(ChartType) {
		case "Dashboard":
			var options = {
				chart: {
					renderTo: 'Dashboard',
					borderColor: 'black',
					borderWidth: 3,
					marginTop : 110
				},
				title: {text: 'Points vs salary expectation'},
				xAxis: {
					categories : Xlabels,
					title: {text: 'Date'}
		        },
		        yAxis: [{ // Primary yAxis
		            labels: {format: '{value}$'},
		            title: {text: 'Salary'}
		        }, { // Secondary yAxis
		            title: {text: 'Points +/-'},
		            labels: {format: '{value}pts'},
		            opposite: true
		        }],
			    series: [{
			    	type: 'spline',
			        name: 'Salary',
			        data: SalaryData,
			        tooltip: {valueDecimals: 0, valuePrefix: '$',}
			    }, {
			    	type: 'column',
			        name: '+/-',
			        yAxis: 1,
			        data: ExpectedData,
			        threshold: 0,
			        negativeColor: 'red',
			        color: 'green',
			        tooltip: {valueDecimals: 2,valueSuffix: 'pts'}
			    }],
			    tooltip : {
			    	crosshairs : true,
			    	shared : true
			    	},
		    	exporting: {
		    		buttons: {
		    			Last10: {text: 'Last 10 games',onclick: function () {main(null,10)}},
		    			Last16: {text: 'Last 16 games',onclick: function () {main(null,16)}},
		    			All: {text: 'All',onclick: function () {main(null,0)}}
		    		}
		    	},
		        credits: {enabled: false}
			}
			break;
		case "Distribution":
			var options = {
				chart: {
					renderTo: 'Distribution',
					borderColor: 'black',
					borderWidth: 3,
					type: 'column',
			        alignTicks: false,
			        showAxes: true
				},
				exporting: {enabled: false},
				legend: {enabled: false},
				plotOptions: {
			        series: {
			            minPointLength: 1,
			            shadow: false,
			            marker: {enabled: false}
			        }
			    },
				title: {text: 'Range of outcomes of a '+position+' '},
				subtitle: {text: 'who is '+SalaryData[1]+' '+SalaryData[4]+', facing a '+SalaryData[3]+' opponent with a DVOA of '+SalaryData[2]},
				tooltip: {
				    formatter: function() {
				        return 'Frequency is ' + this.y;
				    }
				},
		        xAxis: {
			        lineColor: '#999',
			        tickColor: '#ccc',
			        plotLines: Xlabels,
			        plotBands: plotBands,
			        title: {text: 'Point limits per standard devision from average'}
			    },
			    yAxis: {title: {text: 'Frequency'}},
			    series: [{
			        data: [
			            [-3.25, ExpectedData[0]],
			            [-2.75, ExpectedData[1]],
			            [-2.25, ExpectedData[2]],
			            [-1.75, ExpectedData[3]],
			            [-1.25, ExpectedData[4]],
			            [-0.75, ExpectedData[5]],
			            [-0.25, ExpectedData[6]],
			            [+0.25, ExpectedData[7]],
			            [+0.75, ExpectedData[8]],
			            [+1.25, ExpectedData[9]],
			            [+1.75, ExpectedData[10]],
			            [+2.25, ExpectedData[11]],
			            [+2.75, ExpectedData[12]],
			            [+3.25, ExpectedData[13]]
			        ],
			        pointRange: 0.5,
			        borderColor: '#666',
			        pointPadding: .015,
			        groupPadding: 0
			    }, 
			    {type: 'area',name: 'Sigma Bands',}
			    ]
			}
			break;
	}
	return options;
	
}
function Indicators (Ind) {
	switch(Ind) {
		case "AvgPts":
			alert("Represents the average number of points the player has scored.");
			break;
		case "Const":
			alert("Represents the number of times a player exceeded his salary-based expectation.");
			break;
		case "SalChg":
			alert("Represents salary change from the first to the last data point.");
			break;
	}
}
$(function() { //http://api.jqueryui.com/slider/#option-values
	$("#slider").slider({
		change:function() {
			main ($("#slider").slider("value"),null)
		},
		value: 50,
		min: 0,
		max: 100,
		step: 5
	})
	.each(function() {
		//Add labels to slider whose values are specified by min, max and whose step is set to 5
		var opt = $(this).data().uiSlider.options; // Get the options for this slider
		var vals = opt.max - opt.min; // Get the number of possible values
	  
		//Space out values
		for (var i = 0; i <= vals; i+=opt.step) {
			var el = $('<label>'+(i)+'%</label>').css('left',(i/vals*opt.max)+'%');
			$("#slider").append(el);
		}
	});
});
var Ind, Pos, Team, ChartType, options, Player,ColData,LineData,ExpectedData,slider,Avg,SD,xLabels,ShowData,SalChg,cons;