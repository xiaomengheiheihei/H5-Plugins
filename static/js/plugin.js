/**
 * plugin
 */ 

/**
 * template data
 */  
var typeList = [], templateTypeList = [], channels, config, dragInfo, currentId;
renderEvent();
$.ajax({
    url: '/getJson',
    type: 'get',
    data: '',
    dataType: 'json',
    success: function (data) {
        console.log(data)
        channels = data.avconfig.channeltemplates.channels;
        makeTypeList(channels);
        renderName(channels);
        makeTemplateType(channels);
        renderTransitions(channels);
    },
    error: function (err) {

    },
    complete: function () {}
})

// 获取配置信息
$.ajax({
    url: '/getConfig',
    type: 'get',
    data: '',
    dataType: 'json',
    success: function (data) {
        if (data.success === 1) {
            config = data.data.data;
        } else {
            alert(data.error.msg);
        }
    },
    error: function (err) {

    },
    complete: function () {}
})

// postmessage Register message
if (window.addEventListener) {
    window.addEventListener('message', mosMsgFromHost, false);
} else if (window.attachEvent) {
    window.attachEvent('message', mosMsgFromHost, false);
}



// window.parent.postMessage(message, getNewsroomOrigin());

function getNewsroomOrigin() {
    var qs = document.location.search.split("+").join(" ");
    var params = {};
    var regex = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = regex.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params['origin'];
}

function mosMsgFromHost(event) {
    var message = event.data;
    // Check the Origin in event.origin to ensure it matches
    // our expected NCS origin parameter.
    if (event.origin != getNewsroomOrigin()) {
        alert('Origin does not match');
        return;
    }
    // Handle the Message
    // To Reply, issue a postMessage on the event source.
    var reply = "SOME MOS MESSAGE";
    event.source.postMessage(reply, event.origin);
}


// drap
$('#drap-content')[0].addEventListener('dragstart', function (ev) {
    var mos = createData();
    $('#drap-content').html(mos);
    ev.dataTransfer.setData("text", safe_tags_replace(ev.target.innerHTML));
})


// 替换lt or gt
var tagsToReplace = {
    '&lt;': '<',
    '&gt;': '>'
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safe_tags_replace(str) {
    return str.replace(/&lt;|&gt;/g, replaceTag);
}

// 组装typelist数组
function makeTypeList(data) {
    for(var i = 0; i < data.length; i++) {
        if (data[i].$.default == "True") {
            if (!!data[i].channel) {
                var channel = data[i].channel;
                for (var j = 0; j < channel.length; j++) {
                    if (typeList.length > 0) {
                        var flag = false;
                        for(var m = 0; m < typeList.length; m++) {
                            if (typeList[m].type == channel[j].$.type) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            typeList.push(channel[j].$);
                        }
                    } else {
                        typeList.push(channel[j].$);
                    }
                }
            } else {
                typeList = [];
            }
        }
    }
    renderType(typeList);
}


// 组装templatetypelist
function makeTemplateType (data, type) {
    for(var i = 0; i < data.length; i++) {
        if (data[i].$.default == "True") {
            if (!!data[i].channel) {
                templateTypeList = [];
                var channel = data[i].channel;
                var type = type || channel[0].$.type;
                for (var j = 0; j < channel.length; j++) {
                    if (type == channel[j].$.type) {
                        templateTypeList.push(channel[j].$);
                    }
                }
            } else {
                templateTypeList = [];
            }
            
        }
    }
    renderTemplatetype(templateTypeList);
}

// render name
function renderName (data) {
    var html = '';
    for(var i = 0; i < data.length; i++) {
        if (data[i].$.default == "True") {
            html += '<option selected="selected" value="'+ data[i].$.name +'">'+ data[i].$.name +'</option>'
        } else {
            html += '<option value="'+ data[i].$.name +'">'+ data[i].$.name +'</option>';
        }
    }
    $('#templateName').children().remove();
    $('#templateName').append(html);
}

// render type
function renderType (data) {
    var html = '';
    for(var i = 0; i < data.length; i++) {
        if (i === 0) {
            html += '<li choosed="1" channelId="'+ data[i].ID +'" type="'+ data[i].type +'">'+ changeType(data[i].type) +'</li>'
        } else {
            html += '<li choosed="0" channelId="'+ data[i].ID +'" type="'+ data[i].type +'">'+ changeType(data[i].type) +'</li>'
        }
    }
    $('.left-wrap ul').children().remove();
    $('.left-wrap ul').append(html);
    // selected default item
    $.each($('.left-wrap ul li'), function (i,v) {
        if($(v).attr('choosed') == 1) {
            $(v).addClass('type-selected');
        }
    })
}

function changeType(type) {
    var result = '';
    switch (type) {
        case '0':
            result = 'CAM';
            break;
        case '1':
            result = 'PACKAGE';
            break;
        case '2':
            result = 'VOICEOVER';
            break;
        case '3':
            result = 'LIVE';
            break;
        case '4':
            result = 'FULLSCREEN GRAPHICS';
            break;
        case '5':
            result = 'DEV,BOXES';
            break;
        case '6':
            result = 'JINGLE';
            break;
        case '7':
            result = 'TELEPHONE';
            break;
        case '8':
            result = 'ADLIBPIX,FLOATS';
            break;
        case '9':
            result = 'BREAK';
            break;
        case '100':
            result = 'LOWERTHIEDS';
            break;
        case '215':
            result = 'AUDIOFILE';
            break;
        case '220':
            result = 'ACCESSORIES';
            break;
        case '275':
            result = 'COMMAND';
            break;
        case '320':
            result = 'TEXT';
            break;
        default:
            console.log('unknow type');
            break;
    }
    return result;
}

// render templatetype
function renderTemplatetype (data) {
    var html = '';
    for(var i = 0; i < data.length; i++) {
        if (i === 0) {
            html += '<li choosed="1" channelId="'+ data[i].ID +'">'+ data[i].templatetype +'</li>'
        } else {
            html += '<li choosed="0" channelId="'+ data[i].ID +'">'+ data[i].templatetype +'</li>'
        }
    }
    $('.center-wrap ul').children().remove();
    $('.center-wrap ul').append(html);
    // selected default item
    $.each($('.center-wrap ul li'), function (i,v) {
        if($(v).attr('choosed') == 1) {
            $(v).addClass('type-selected');
        }
    })
    templateTypeList.length > 0 ? $('.channel-name').html(templateTypeList[0].name) : '';
    templateTypeList.length > 0 ? $('.des-wrap .des-content').html(templateTypeList[0].description) : '';
}

// render transitions
function renderTransitions (data, id) {
    var html = '';
    var formItem = '';
    var hasChannel = true;
    for(var i = 0; i < data.length; i++) {
        if (data[i].$.default == "True") {
            if (!!data[i].channel) {
                var id = id || data[i].channel[0].$.ID;
                for(var z = 0; z < data[i].channel.length; z++) {
                    if (id == data[i].channel[z].$.ID) {
                        if (!!data[i].channel[z].switcher_setup && !!data[i].channel[z].switcher_setup.transitions) {
                            var transition = data[i].channel[z].switcher_setup.transitions.transition;
                            var defaultValue = data[i].channel[z].switcher_setup.transitions.$;
                            for(var j = 0; j < transition.length; j++) {
                                if (transition[j].$.name == defaultValue.value) {
                                    html += '<option selected="selected" value="'+ transition[j].$.name +'">'+ transition[j].$.name +'</option>';
                                    if(transition[j].field.$.fieldtype != 'LIST') {
                                        if ($('.transition-select-form')) {$('.transition-select-form').remove()}
										if ($('#transition-form-item')) {$('#transition-form-item').remove()}
                                        formItem += '<input type="'+ transition[j].field.$.fieldtype +'" name="'+ transition[j].field.$.name +'" id="transition-form-item" value="'+ ((!!transition[j].field.$.value) ? transition[j].field.$.value : '0') +'" min="'+ transition[j].field.$.range.split(',')[0] +'" max="'+ transition[j].field.$.range.split(',')[1] +'">'
                                    } else {
                                        if ($('#transition-form-item')) {$('#transition-form-item').remove()}
										if($('.transition-select-form')) {$('.transition-select-form').remove()}
                                        formItem += '<select name="'+ transition[j].field.$.name +'" class="transition-select-form">';
                                        for(var m = 0; m < 3; m++) {
                                            if(m === 0) {
                                                formItem += '<option selected="selected" value="'+ (m+1)+transition[j].field.$.keylist+(m+1) +'">'+ (m+1)+transition[j].field.$.keylist+(m+1) +'</option>';
                                            } else {
                                                formItem += '<option value="'+ (m+1)+transition[j].field.$.keylist+(m+1) +'">'+ (m+1)+transition[j].field.$.keylist+(m+1) +'</option>';
                                            }
                                        }
                                        formItem += '</select>';
                                    }
                                } else {
                                    html += '<option value="'+ transition[j].$.name +'">'+ transition[j].$.name +'</option>'
                                }
                            }
                        } else {
                            hasChannel = false;
                        }
                    }
                }
            } else {
                hasChannel = false;
            }
        }
    }
    if (!hasChannel) {
        $('#transition-select').addClass('none');
    } else {
        $('#transition-select').removeClass('none');
    }
    $('#transition-select').children().remove();
    $('#transition-select').append(html);
    $('.transition-main').children('input').remove();
    $('.transition-main').append(formItem);
}

// event
function renderEvent () {
    // setup tap切换
    $('.nav-tap-wrap ul li').on('click', function () {
        $('.nav-tap-wrap section').addClass('none');
        switch ($(this)[0].innerHTML) {
            case 'Transition':
                $('.transition-main').removeClass('none');
                break;
            case 'audio':
                $('.audio-main').removeClass('none');
                break;
            case 'others':
                $('.others-main').removeClass('none');
                break;
        }
    })

    // name change
    $('#templateName').on('change', function (e) {
        for (var i = 0; i < channels.length; i++) {
            channels[i].$.default = "False";
            if ($(this).val() == channels[i].$.name) {
                channels[i].$.default = "True";
            }
        }
        makeTypeList(channels);
        renderName(channels);
        makeTemplateType(channels);
        renderTransitions(channels);
    })

    // 选择type
    $('.left-wrap ul').on('click', 'li', function () {
        if ($(this).hasClass('type-selected')) {return false}
        $('.left-wrap ul li').attr('choosed', 0);
        $(this).attr('choosed', 1);
        $('.left-wrap ul li').removeClass('type-selected');
        $(this).addClass('type-selected');
        makeTemplateType(channels, $(this).attr('type'));
        $('.center-wrap ul li')[0].click();
    })

    // 选择templatetype
    $('.center-wrap ul').on('click', 'li', function () {
        if ($(this).hasClass('type-selected')) {return false}
        $('.center-wrap ul li').attr('choosed', 0);
        $(this).attr('choosed', 1);
        $('.center-wrap ul li').removeClass('type-selected');
        $(this).addClass('type-selected');
        renderTransitions(channels, $(this).attr('channelid'));
		currentId =  $(this).attr('channelid');
        for (var i = 0; i < templateTypeList.length; i++) {
            if ($(this).attr('channelid') == templateTypeList[i].ID) {
                $('.channel-name').html(templateTypeList[i].name);
                $('.des-wrap .des-content').html(templateTypeList[i].description);
            }
        }
    })

    // 切换transition
    $('#transition-select').change(function (e) {
        var id = findItem(true);
        var _this = $(this);
        channels.forEach(function(element) {
            if (!!element.channel) {
                element.channel.forEach(function(ele) {
                    if (ele.$.ID == id) {
                        ele.switcher_setup && ele.switcher_setup.transitions ? ele.switcher_setup.transitions.$.value = _this.val() : '';
                    }
                })
            }
        });
        renderTransitions(channels, currentId);
    })

    // 预览
    $('.preview').click(function () {
        var mos = createData();
        $('.pre-mos').html(mos);
    })


    var clipboard = new ClipboardJS('.copy-btn');

    clipboard.on('success', function(e) {
        alert('复制成功');
    });
}


function createData () {
    if (!config) {alert('请开启服务！')}
        var choosedChannel = findItem();
        var choosedTransition;
        choosedChannel.switcher_setup.transitions.transition.forEach(function (ele) {
            if ($('#transition-select').val() == ele.$.name) {
                choosedTransition = ele;
            }
        })
        var mos =   '&lt;mos&gt;' + 
                    '&lt;ncsItem&gt;' +
                    '&lt;item&gt;' +
                    '&lt;itemID&gt;' + 0 + '&lt;/itemID&gt;'+
                    '&lt;objID&gt;'+ changeType(choosedChannel.$.type) + ';' + choosedChannel.$.templatetype +'&lt;/objID&gt;' +
                    '&lt;mosID&gt;'+ config.mosID +'&lt;/mosID&gt;' + 
                    '&lt;mosPlugInID&gt;'+ config.mosPlugInID +'&lt;/mosPlugInID&gt;' +
                    '&lt;mosItemBrowserProgID&gt;'+ config.mosItemBrowserProgID +'&lt;/mosItemBrowserProgID&gt;' + 
                    '&lt;mosItemEditorProgID&gt;'+ config.mosItemEditorProgID +'&lt;/mosItemEditorProgID&gt;' + 
                    '&lt;mosAbstract&gt;'+ changeType(choosedChannel.$.type) + ' ' + choosedChannel.$.templatetype + ' ' + 
                    $('#transition-select').val() + ' ' + ($('#transition-form-item').val() == undefined ? $('.transition-select-form').val() : $('#transition-form-item').val()) +'&lt;/mosAbstract&gt;' +
                    '&lt;mosExternalMetadata&gt;' +
                    '&lt;mosScope&gt;PLAYLIST&lt;/mosScope&gt;' + 
                    '&lt;mosSchema&gt;http://www.mosartmedialab.no/schema/mositem.dtd&lt;/mosSchema&gt;' +
                    '&lt;mosPayload&gt;' + 
                    '&lt;mosarttemplate&gt;' + 
                    '&lt;type name="'+ changeType(choosedChannel.$.type) +'" category=""&gt;' +
                    '&lt;variants value="' + choosedChannel.$.templatetype + '" fieldtype="LIST"&gt;' +
                    '&lt;variant name="' + choosedChannel.$.templatetype +'"&gt;' + 
                    '&lt;transitions value="'+$('#transition-select').val()+'" enable="false"&gt;' +
                    '&lt;transition name="'+$('#transition-select').val()+'"&gt;' +
                    (choosedTransition.field.$.fieldtype == 'NUMBER' ? '&lt;field name="'+choosedTransition.field.$.name+'" value="'+$('#transition-form-item').val()+'" fieldtype="'+choosedTransition.field.$.fieldtype+'" range="'+choosedTransition.field.$.range+'" /&gt;' : '&lt;field name="'+choosedTransition.field.$.name+'" value="'+$('.transition-select-form').val()+'" fieldtype="'+choosedTransition.field.$.fieldtype+'" /&gt;') +
                    '&lt;/transition&gt;' +
                    '&lt;/transitions&gt;' +
                    '&lt;fields /&gt;' +
                    '&lt;/variant&gt;' +
                    '&lt;/variants&gt;' +
                    '&lt;/type&gt;' +
                    '&lt;/mosarttemplate&gt;' +
                    '&lt;/mosPayload&gt;' +
                    '&lt;/mosExternalMetadata&gt;' +
                    '&lt;item&gt;' +
                    '&lt;/ncsItem&gt;' +
                    '&lt;/mos&gt;';
    return mos;
}

// find choosed item
function findItem (findId) {
    var id;
    var choosedChannel;
    $.each($('.center-wrap ul li'), function () {
        if ($(this).attr('choosed') == 1) {
            id = $(this).attr('channelid');
        }
    })
    if (!!findId) return id;
    channels.forEach(function(element) {
        if (!!element.channel) {
            element.channel.forEach(function(ele) {
                if (ele.$.ID == id) {
                    choosedChannel = ele;
                }
            })
        }
    });
    return choosedChannel;
}