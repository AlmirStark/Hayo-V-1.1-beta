// adiciona formatação de número de telefone no helper do HandleBars
Handlebars.registerHelper("formatTelefone", function(telefNumero) {
    
    var tamanho = telefNumero.length;
    
    if (tamanho <= 5) {
        //  não formata números de emergência tais como: 191, 193, etc.
	    return telefNumero;

    }else{

    	return "(" + telefNumero.substr(0,2) + ") " + telefNumero.substr(2,4) + "-" + telefNumero.substr(6,4);
    }      
          
});  

// cria formatos de exibição de Datas.
var DataFormatos = {
       completa: "DD/MM/YYYY",
       diames: "DD/MM"
};

// Deprecated since version 0.8.0 
Handlebars.registerHelper("formataData", function(dataevento, formato) {
// adiciona formatação de número de telefone no helper do HandleBars
//UI.registerHelper("formataData", function(datatime, formato) {

  if (moment) {
    f = DataFormatos[formato];   
    return moment(dataevento).format(f);
  } else {
      
      return dataevento;
  }
});