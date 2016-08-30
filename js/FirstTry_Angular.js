//Premier test d'une class AngularJS

var app = angular.module('app',['nvd3','ui.bootstrap']);



app.controller("ReportCtrl",function($scope, $http, $rootScope, $sce) {
	$scope.isArray = angular.isArray;
	$scope.isCollapsed = true;
	$http.get("res/grosZap.xml", {
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
		
		//Variables 
		$scope.content = response.data;
		$scope.values = $scope.Risk($scope.content);
		$scope.nbvuln = $scope.NbRisk($scope.content);
		$scope.low = Math.round((($scope.nbvuln[0]/($scope.nbvuln[1]+$scope.nbvuln[0]+$scope.nbvuln[2]))*100));
		$scope.nbLow=$scope.nbvuln[0];
		$scope.med = Math.round((($scope.nbvuln[1]/($scope.nbvuln[1]+$scope.nbvuln[0]+$scope.nbvuln[2]))*100));
		$scope.nbMed=$scope.nbvuln[1];
		$scope.high = Math.round((($scope.nbvuln[2]/($scope.nbvuln[1]+$scope.nbvuln[0]+$scope.nbvuln[2]))*100));
		$scope.nbHigh=$scope.nbvuln[2];
		
		if ($scope.high === 0 && $scope.nbHigh !== 0) {
			$scope.high = '1';
		}
		if ($scope.med === 0 && $scope.nbMed !== 0) {
			$scope.med = '1';
		}
		if ($scope.low === 0 && $scope.nbLow !== 0) {
			$scope.low = '1';
		}
		
		//Variable pour remplir le graphe
		$scope.data = [
		               {
		            	   key: "Low: " + $scope.nbvuln[0],
		            	   y: $scope.low
		               },
		               {
		            	   key: "Medium: " + $scope.nbvuln[1] ,
		            	   y: $scope.med
		               },
		               {
		            	   key: "High: " + $scope.nbvuln[2] ,
		            	   y: $scope.high*2
		               }
		               ];	
	});


	//Methode pour determiner le nombre d'alertes par type
	$scope.NbRisk = function(contenu) {
		var compteur = [0,0,0];
		angular.forEach(contenu, function(site, key) {
			angular.forEach(site.alerts,function(alert, key) {
				angular.forEach(alert,function(item, key) {
					if (item.riskcode) {
						compteur[item.riskcode-1] = compteur[item.riskcode-1] + parseInt(item.count);
					}
				});
			});
		});
		return compteur;
	};
	
	//Methode pour determiner la quantite pour chaque type d'alerte
	$scope.Risk = function(contenu) {
		var compteur = [0,0,0];
		angular.forEach(contenu, function(site, key) {
			angular.forEach(site.alerts,function(alert, key) {
				angular.forEach(alert,function(item, key) {
					if (item.riskcode) {
						compteur[item.riskcode-1] = compteur[item.riskcode-1] + 1;
					}
				});
			});
		});
		return compteur;
	}; 


	//Methode permettant de supprimer les sites ayant des alerts vides. 
	$scope.traitementReport = function (report) {
		var newReport = []
		console.log(JSON.stringify(report));
		if(!angular.isArray(report.OWASPZAPReport.site)){
			var site = report.OWASPZAPReport.site;
			report.OWASPZAPReport.site=[];
			report.OWASPZAPReport.site.push(site);
		}
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

	//Methode permettant d'interpreter du langage HTML
	$scope.SkipValidation = function(value) { return $sce.trustAsHtml(value); }; 

	//Variable qui definit les options du graphe
	$scope.options = {
			chart: {

				type: 'pieChart',
				height:450,
				width: 650,
				x: function(d){return d.key;},
				y: function(d){return d.y;},
				showLabels: true,
				duration: 500,
				showLegend: false,
				labelThreshold: 0.01,
				labelSunbeamLayout: false,
				color: ['#82cfe6', '#eea239', '#b52e2b'],
				donut: true,
				labelsOutside:true,
				margin: {
					top: 0,
					right: 100,
					bottom: -25,
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

