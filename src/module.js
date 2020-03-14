import angular from "angular";
import "./bootstrapper";


angular.module("app").controller("HelloController", function($scope, $timeout) {
	$scope.person = "andrew";
	$timeout(() => {
		$scope.showExtras = true;
		$scope.two = "two";
	}, 700);
	$timeout(() => {
		$scope.one = "ofasdfgkljfadkgjadfkgjne";
		$scope.two = "two";
	}, 1400);
});

import tabs from "./components/tabs";
angular.module("app").component("tabs", tabs);
import tab from "./components/tab";
angular.module("app").component("tab", tab);
