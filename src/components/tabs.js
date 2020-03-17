import angular from "angular";
import template from "./tabs.html";
import debounce from "lodash/debounce";
import "./array.from.polyfill";

export default {
	bindings: {
		prop: "<",
	},
	template: template,
	transclude: true,
	controller: TabsController
};

var keys = {
	end: 35,
	home: 36,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	delete: 46,
	enter: 13,
	space: 32
};

TabsController.$inject = ["$scope", "$element", "$timeout", "$window"];
function TabsController($scope, $element, $timeout, $window) {
	var $ctrl = this;
	var contentElm;
	$ctrl.registeredTabIds = new Set;

	$ctrl.$onInit = function () {
		$window.addEventListener("resize", debounce(testBounds, 500));
		contentElm = $element[0].querySelector("[role='tablist']");
	};

	$ctrl.registerTab = function (tab) {
		console.log("registering", tab, tab.uuid);
		$ctrl.registeredTabIds.add(tab.uuid);
		buildList();
		testBounds();
	};
	
	$ctrl.deregisterTab = function (tab) {
		console.log("deregistering", tab, tab.uuid);
		$ctrl.registeredTabIds.delete(tab.uuid);
		buildList();
		testBounds();
	};

	$ctrl.updateTab = function (tab) {
		// console.log("updating", tab, tab.uuid);
		buildList();
		testBounds();
	};

	var buildList = function () {
		$ctrl.tabsList = Array.from(angular.element(contentElm).find("tab"))
			.map(function (tabElement) {
				return tabElement.id;
			})
			.filter(function (id) {
				return Array.from($ctrl.registeredTabIds).find(function (registeredTabId) {
					return registeredTabId === id;
				});
			});
	};

	var testBounds = function () {
		if ($ctrl.timeout) $timeout.cancel($ctrl.timeout);
		if (contentElm) contentElm.classList.add("tabs-content--measuring");
		$ctrl.timeout = $timeout(function () {
			// console.log(contentElm.scrollWidth, contentElm.clientWidth);
			$ctrl.isVertical = (contentElm && contentElm.scrollWidth > contentElm.clientWidth);
			contentElm.classList.remove("tabs-content--measuring");
		});
	};

	$ctrl.handleClick = function(tab, event) {
		console.log("tab clicked", tab, event);
		$ctrl.activeTab = tab.uuid;
	};
	$ctrl.handleFocus = function(tab, event) {
		console.log("tab focused", tab, event);
		$ctrl.focusedTab = tab.uuid;
	};
	$ctrl.handleKeyDown = function(tab, event) {
		var keyCode = event.keyCode;
		console.log(keyCode);
		switch (keyCode) {
		case keys.right:
			if (!$ctrl.isVertical) {
				next();
			}
			break;
		case keys.down:
			if ($ctrl.isVertical) {
				next(); 
			}
			break;
		default:
			return;
		}
	};

	function next () {
		var index = $ctrl.tabsList.findIndex(function (tabId) {
			console.log($ctrl.focusedTab, tabId);
			return tabId === $ctrl.focusedTab;
		});
		var targetId = $ctrl.tabsList[index + 1];
		if (targetId) {
			console.log("changing to ", targetId);
			$ctrl.focusedTab = targetId;
		}
	}

}
