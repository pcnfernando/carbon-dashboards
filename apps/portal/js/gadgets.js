/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(function () {
    var gadgets = [];
    var isStillLoading = false;
    var nextStart = 0;
    var hasMore = true;

    /**
     * Page count.
     * @const
     */
    var PAGE_COUNT = 10;

    // Pre-compiling handlebar templates
    var gadgetsListHbs = Handlebars.compile($("#ues-gadgets-list-hbs").html());
    var gadgetThumbnailHbs = Handlebars.compile($("#ues-gadget-thumbnail-hbs").html());
    var gadgetConfirmHbs = Handlebars.compile($("#ues-gadget-confirm-hbs").html());
    var gadgetsEmptyHbs = Handlebars.compile($("#ues-gadgets-empty-hbs").html());
    Handlebars.registerPartial('ues-gadget-thumbnail-hbs', gadgetThumbnailHbs);

    /**
     * Load the list of gadgets available.
     * @private
     * */
    var loadGadgets = function () {
        isStillLoading = true;

        if (!hasMore) {
            isStillLoading = false;
            return;
        }
        ues.store.assets('gadget', {
            start: 0,
            count: 20
        }, function (err, data) {
            gadgets = gadgets.concat(data);
            var dashboardsEl = $('#ues-gadgets-portal').find('.ues-gadgets');
            dashboardsEl.html(gadgetsListHbs(data));
        });
    };

    /**
     * Find the gadget using gadget id.
     * @param id
     * @return {object}
     * @private
     * */
    var findGadget = function (id) {
        var index;
        var gadget;
        var length = gadgets.length;
        for (index = 0; index < length; index++) {
            gadget = gadgets[index];
            if (gadget.id === id) {
                return gadget;
            }
        }
    };

    var deleteGadget = function(id) {
        ues.store.deleteAsset('gadget', id, function (err, data) {
        });
        location.reload();
    };
    /**
     * Initialize the UI functionality such as binding events.
     * @private
     * */
    var initUI = function () {
        var portal = $('#ues-gadgets-portal');
        portal.on('click', '.ues-gadgets .ues-gadget-trash-handle', function (e) {
            e.preventDefault();
            var thiz = $(this);
            var gadgetElement = thiz.closest('.ues-gadget');
            var id = gadgetElement.data('id');
            var gadget = findGadget(id);
            gadgetElement.html(gadgetConfirmHbs(gadget));
        });

        portal.on('click', '.ues-gadgets .ues-gadget-trash-confirm', function (e) {
            e.preventDefault();
            deleteGadget($(this).closest('.ues-gadget').data('id'));
        });

        portal.on('click', '.ues-gadgets .ues-gadget-trash-cancel', function (e) {
            e.preventDefault();
            var thiz = $(this);
            var gadgetElement = thiz.closest('.ues-gadget');
            var id = gadgetElement.data('id');
            var dashboard = findGadget(id);
            gadgetElement.html(gadgetThumbnailHbs(dashboard));
        });

        $(window).scroll(function () {
            var win = $(window);
            var doc = $(document);
            if (win.scrollTop() + win.height() < doc.height() - 100) {
                return;
            }

            if (!isStillLoading) {
                loadGadgets();
            }
        });
    };

    initUI();
    loadGadgets();
});