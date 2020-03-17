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
	$ctrl.registeredTabs = new Map;

	$ctrl.$onInit = function () {
		$window.addEventListener("resize", debounce(testBounds, 500));
		contentElm = $element[0].querySelector("[role='tablist']");
	};

	$ctrl.registerTab = function (tab) {
		console.log("registering", tab, tab.uuid);
		$ctrl.registeredTabs.set(tab.uuid, tab);
		updateAll();
	};
	
	$ctrl.deregisterTab = function (tab) {
		console.log("deregistering", tab.uuid);
		$ctrl.registeredTabs.delete(tab.uuid);
		updateAll();
	};

	$ctrl.handleTabUpdate = function (tab) {
		// console.log("updating", tab, tab.uuid);
		updateAll();
	};

	var updateAll = function () {
		buildList();
		testBounds();
		updateTabs();
	};

	var buildList = function () {
		$ctrl.tabsList = Array.from(angular.element(contentElm).find("tab"))
			.map(function (tabElement) {
				return tabElement.id;
			})
			.filter(function (id) {
				// console.log($ctrl.registeredTabs.entries());
				// debugger;
				return (Array.from($ctrl.registeredTabs.keys())).find(function (registeredTabId) {
				// return $ctrl.registeredTabs.entries().find(function (registeredTabId) {
					return registeredTabId === id;
				});
			});
	};

	var updateTabs = function () {
		$ctrl.tabsList.forEach(function (tabId) {
			if ($ctrl.focusedTab === tabId) {
				var link = document.querySelector("#" + tabId + " a");
				if (document.activeElement !== link) {
					link.focus();
				}
			}
			// $ctrl.registeredTabs.get(tabId).update({
			// 	isActive: $ctrl.activeTab === tabId,
			// 	isFocused: $ctrl.focusedTab === tabId,
			// });
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
		updateTabs();
	};
	$ctrl.handleFocus = function(tab, event) {
		console.log("tab focused", tab, event);
		$ctrl.focusedTab = tab.uuid;
		updateTabs();
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
		updateTabs();
	}

}
