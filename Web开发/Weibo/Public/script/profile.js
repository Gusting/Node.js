// JavaScript Document
//΢���ı���ȡ����
function blogtextfocus() {
    if (document.getElementById("blogtext").value == "��������ʲô��") {
        document.getElementById("blogtext").value = "";
        document.getElementById("blogtext").style.color = "#000000";
    }
}
//΢���ı�ʧȥ����
function blogtextblur() {
    if (document.getElementById("blogtext").value == "") {
        document.getElementById("blogtext").value = "��������ʲô��";
        document.getElementById("blogtext").style.color = "#999999";
    }
}