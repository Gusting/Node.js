// JavaScript Document
function myBrowser() {
    var userAgent = navigator.userAgent; //ȡ���������userAgent�ַ���
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera";
    } //�ж��Ƿ�Opera����� 
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //�ж��Ƿ�Firefox����� 
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //�ж��Ƿ�Safari����� 
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }  //�ж��Ƿ�IE�����
} 