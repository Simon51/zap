//Premier test d'une class AngularJS

var app = angular.module('app',['nvd3','ui.bootstrap']);



app.controller("ReportCtrl",function($scope, $http, $rootScope) {
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
		            	   key: "High",
		            	   y: $scope.values[0]
		               },
		               {
		            	   key: "Medium",
		            	   y: $scope.values[1]
		               },
		               {
		            	   key: "Low",
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
		console.log('ccccc ' +compteur);
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



	$scope.options = {
			chart: {
				type: 'pieChart',
				height: 400,
				x: function(d){return d.key;},
				y: function(d){return d.y;},
				showLabels: true,
				duration: 500,
				labelThreshold: 0.01,
				labelSunbeamLayout: false,
				legend: {
					margin: {
						top: 5,
						right: 35,
						bottom: 5,
						left: 0
					}
				}
			}
	};

	$scope.data = [
	               {
	            	   key: "High",
	            	   y: 3
	               },
	               {
	            	   key: "Medium",
	            	   y: 2
	               },
	               {
	            	   key: "Low",
	            	   y: 9
	               }
	               ];

});

