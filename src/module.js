import angular from "angular";
import "@uirouter/angularjs";
import "./bootstrapper";

angular.module("app").config(["$locationProvider",
	function ($locationProvider) {
		// $locationProvider.hashPrefix('!');
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: true
		});
	}
]);

angular.module("app").config(["$stateProvider",
	function ($stateProvider) {

		$stateProvider.state({
			name: "root",
			url: "/",
		});

		$stateProvider.state({
			name: "tab",
			url: "/tab/{id}",
		});

	}]);


angular.module("app").controller("HelloController", function($scope, $timeout) {
	$scope.person = "andrew";
	$timeout(() => {
		$scope.showExtras = true;
		$scope.two = "two";
	}, 700);
	$timeout(() => {
		$scope.one = "ofasdfgkljfadkgjadfkgjne";
		$scope.two = "two";
		$scope.showExtras = false;
	}, 1400);
});

import tabs from "./components/tabs";
angular.module("app").component("tabs", tabs);
import tab from "./components/tab";
angular.module("app").component("tab", tab);

