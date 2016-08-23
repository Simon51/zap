//Premier test d'une class AngularJS

var app = angular.module('app',['nvd3','ui.bootstrap']);



app.controller("ReportCtrl",function($scope, $http, $rootScope, $sce) {
	$scope.isCollapsed = true;
	$http.get("ReportForSpiderWithActiveScan.xml", {


		transformResponse:function(data) {
			                      // convert the data to JSON and provide
			                      // it to the success function below
			                        var x2js = new X2JS();
			                        var json = x2js.xml_str2json( data );
			                        var report = $scope.traitementReport(json);
			return report;

			               }
	                 
	})
	.then(function(response) {
		$scope.content = response.data;
		console.log(response.data);
		$scope.values = $scope.HighRisk($scope.content);
		console.log($scope.values);

		$scope.data = [
		               {
		            	   key: "Medium: " + $scope.values[0],
		            	   y: $scope.values[0]
		               },
		               {
		            	   key: "Low: "+$scope.values[1],
		            	   y: $scope.values[1]
		               },
		               {
		            	   key: "High: " + $scope.values[2] ,
		            	   y: $scope.values[2]
		               }
		               ];
	});



	$scope.HighRisk = function(contenu) {
		console.log('contenu !! ' + JSON.stringify(contenu));
		var compteur = [0,0,0];
		angular.forEach(contenu, function(site, key) {
			console.log('contenu ZZ!! ');
			angular.forEach(site.alerts,function(alert, key) {
				console.log('alerts.alertitem.riskcode : ' + JSON.stringify(alert));
				angular.forEach(alert,function(item, key) {
					if (item.riskcode) {
						compteur[item.riskcode-1] = compteur[item.riskcode-1] + 1;
					}
				});
			});
		});
		return compteur;
	};


	$scope.traitementReport = function (report) {
		var newReport = []
		angular.forEach(report.OWASPZAPReport.site,function(site, key){
			if (site.alerts!==""){
				if (!angular.isArray(site.alerts.alertitem)){
					var tmp = site.alerts.alertitem;
					site.alerts.alertitem = [];
					site.alerts.alertitem.push(tmp);
				}

				newReport.push(site);
			}
		});
		return newReport;
	}; 

	$scope.SkipValidation = function(value) { return $sce.trustAsHtml(value); }; 

	$scope.options = {
			chart: {
				type: 'pieChart',
				height: 450,
				x: function(d){return d.key;},
				y: function(d){return d.y;},
				showLabels: true,
				duration: 500,
				labelThreshold: 0.01,
				labelSunbeamLayout: false,
//				pie: {
//                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
//                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
//                },
                margin: {
					top: 0,
					right: 100,
					bottom: -30,
					left: 100
				},
				legend: {
					margin: {
						top: 10,
						right: 500,
						bottom: 5,
						left: 500
					}
				},
				tooltip: {
					enabled : false
				}
				
			}
	};

});

