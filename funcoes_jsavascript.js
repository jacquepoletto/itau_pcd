//JAVASCRIPT

//quando a pagina carregar
window.onload=function(){
	listar();
	document.getElementById('frmCadastro').addEventListener('submit', adicionarOuAlterar);
	document.getElementById('frmCadastro').addEventListener('submit', listar);
}

var idAlterar = null;

//Evento do botao cadastrar/salvar
function adicionarOuAlterar(e){
	var p = {
		nome : document.getElementById('txtNome').value,
		cpf : document.getElementById('txtCpf').value,
		rg : document.getElementById('txtRg').value,
		sexo : document.getElementById('rdoMasculino').checked ? 'M' : 'F',
		endereco : document.getElementById('txtEndereco').value,
		numero : document.getElementById('txtNumero').value,
		bairro : document.getElementById('txtBairro').value,
		cidade : document.getElementById('txtCidade').value,
		estado : document.getElementById('comboEstado').value,
		cep : document.getElementById('txtCep').value,
		telefone : document.getElementById('txtTelefone').value,
		celular : document.getElementById('txtCelular').value,
		data : new Date()
	}

	if(idAlterar == null) {
		adicionar(p);
	} else if(idAlterar > 0) {
		alterar(p);
	} else {
		alert("Ação desconhecida");
	}	

	e.preventDefault();
}

function adicionar(p){	
	var pessoas = [];	
	var idValido = 1;	

	if(localStorage.getItem('value') !== null ){
		pessoas = JSON.parse(localStorage.getItem('value'));
				
		if(pessoas.length > 0)
			idValido = 	(function obterIdValido() {
							 //percorre verificando se tiver "buraco" entre os numeros
							for(var i = 0; i < pessoas.length; i++)
								if(pessoas[i].Id != i+1)
									return i + 1;							
							//se nao achar, retorna o id posterior da ultima pessoa
							return pessoas[pessoas.length - 1].Id + 1;
						})();
	}	
	
	var pessoa = {
		Id: idValido,
		Nome: p.nome,
		Cpf : p.cpf,
		Rg : p.rg,
		Sexo: p.sexo,
		Endereco: p.endereco,
		Numero: p.numero,
		Bairro: p.bairro,
		Cidade: p.cidade,
		Estado: p.estado,
		Cep: p.cep,
		TelefoneFixo: p.telefone,
		TelefoneCelular : p.celular,
		DataCadastro : p.data.toLocaleString("pt-BR")
	};
	
	//Adiciona o objeto ao ultimo indice do array
	pessoas.push(pessoa);	
	//Ordeno o array pelo ID do objeto
	pessoas.sort(function(a,b) {
		return a.Id - b.Id;
	});			
	//armazena no Localstorage
	localStorage.setItem('value', JSON.stringify(pessoas));	
	//reseta os campos do formulario
	document.getElementById('frmCadastro').reset();	
}

function alterar(p){
	var btn = document.getElementById('btnCadastrarSalvar');	

	pessoas = JSON.parse(localStorage.getItem('value'));
	//substituir as informaçoes
	for(var i = 0; i < pessoas.length; i++){
		if(pessoas[i].Id == idAlterar){
			pessoas[i].Nome = p.nome;
			pessoas[i].Cpf = p.cpf;
			pessoas[i].Rg = p.rg;
			pessoas[i].Sexo = p.sexo;
			pessoas[i].Endereco = p.endereco;
			pessoas[i].Numero = p.numero;
			pessoas[i].Bairro = p.bairro;
			pessoas[i].Cidade = p.cidade;
			pessoas[i].Estado = p.estado;
			pessoas[i].Cep = p.cep;
			pessoas[i].TelefoneFixo = p.telefone;
			pessoas[i].TelefoneCelular = p.celular;
			pessoas[i].DataCadastro = p.data.toLocaleString("pt-BR");
			
			btn.value = "Cadastrar";
			idAlterar = null;

			localStorage.setItem('value', JSON.stringify(pessoas));	
			document.getElementById('frmCadastro').reset();			
			break;
		}
	}
}

//função do botao Alterar
function prepararAlterar(idRow){	
	document.getElementById('btnCadastrarSalvar').value = "Salvar";
	
	var txtNome = document.getElementById('txtNome'),
		txtCpf = document.getElementById('txtCpf'),
		txtRg = document.getElementById('txtRg'),
	    rdoMasculino = document.getElementById('rdoMasculino'),
	    rdoFeminino = document.getElementById('rdoFeminino'),
		txtEndereco = document.getElementById('txtEndereco'),
		txtNumero = document.getElementById('txtNumero'),
		txtBairro = document.getElementById('txtBairro'),
		txtCidade = document.getElementById('txtCidade'),
		comboEstado = document.getElementById('comboEstado'),
		txtCep = document.getElementById('txtCep'),
		txtTelefone = document.getElementById('txtTelefone'),
		txtCelular = document.getElementById('txtCelular');

	var pessoas = JSON.parse(localStorage.getItem('value'));
	for(var i = 0; i < pessoas.length; i++){
		if(pessoas[i].Id == idRow){			
			//popular os campos
			txtNome.value = pessoas[i].Nome;
			txtCpf.value = pessoas[i].Cpf;
			txtRg.value = pessoas[i].Rg;
			rdoMasculino.checked = !(rdoFeminino.checked = (pessoas[i].Sexo == 'F'));
			txtEndereco.value = pessoas[i].Endereco;
			txtNumero.value = pessoas[i].Numero;
			txtBairro.value = pessoas[i].Bairro;
			txtCidade.value = pessoas[i].Cidade;
			comboEstado.value = pessoas[i].Estado;
			txtCep.value = pessoas[i].Cep;
			txtTelefone.value = pessoas[i].TelefoneFixo;
			txtCelular.value = pessoas[i].TelefoneCelular;

			//recarrega a lista para limpar o th com background alterado
			listar();
			//coloco ID null (caso clicar em varios botao alterar)
			idAlterar = null;
			if(idAlterar === null){
				//mudar o background da nova linha
				var th = document.getElementById("rowTable"+i);				
				th.className = "estadoAlteracao";				
			}

			//atribuir o Id a variavel global
			idAlterar = pessoas[i].Id;
			break;
		}
	}
}

function excluir(cod){
	var pessoas = JSON.parse(localStorage.getItem('value'));

	for(var i = 0; i < pessoas.length; i++)
		if(pessoas[i].Id == cod)
			pessoas.splice(i, 1);
				
	
	localStorage.setItem('value', JSON.stringify(pessoas));
	listar();
	
	//se nao possuir mais nenhum registro, limpar o storage
	if(pessoas.length == 0)
		window.localStorage.removeItem("value");
}

function listar(){
	//se nao possuir nenhum local storage, nao fazer nada
	if(localStorage.getItem('value') === null)
		return;
	
	//captura os objetos de volta
	var pessoas = JSON.parse(localStorage.getItem('value'));
	var tbody = document.getElementById("tbodyResultados");

	//limpar o body toda vez que atualizar
	tbody.innerHTML = '';
	
	for(var i = 0; i < pessoas.length; i++){
		var	id = pessoas[i].Id,
			nome = pessoas[i].Nome,
		    cpf = pessoas[i].Cpf,
		    celular = pessoas[i].TelefoneCelular,
			endereco = pessoas[i].Endereco,
			numero = pessoas[i].Numero,
			data = pessoas[i].DataCadastro
			       
		tbody.innerHTML += '<tr id="rowTable'+i+'">'+
								'<td>'+nome+'</td>'+
								'<td>'+cpf+'</td>'+
								'<td>'+celular+'</td>'+
								'<td>'+endereco+', '+numero+'</td>'+
								'<td>'+data+'</td>'+
								'<td style="width: 70px;"><button onclick="excluir(\'' + id + '\')">Excluir</button></td>'+
								'<td style="width: 70px;"><button onclick="prepararAlterar(\'' + id + '\')">Alterar</button></td>'+
						   '</tr>';		
	}
}

