

let web3 = new Web3(Web3.givenProvider || "ws://localhost:7560");


let nombreMagique = 12;
let allAccounts;
let addressSmartContract ;//= '0x93C5bC2fCc47Ee17Bd7dCddda514738df688cB00'; 
let allTransactions=[];
let nomFonctionAvecParam_JSON=[];
const deploiementContract  = async() => {

	let address = allAccounts[0];
    let payload={
      data: bytecode,
      arguments: [nombreMagique] // Paramètre constructeur 
    }

    let parameter={
      from: address, // Addresse ou adresse privée ?
      gas: web3.utils.toHex(2100000),
      //data : payload,
      //gasPrice: web3.utils.toHex(web3.utils.toWei('30', "gwei")),

    }

    let contratDeploie = new web3.eth.Contract(JSON.parse(abi));
    await contratDeploie.deploy(payload).send(parameter, function(error, transactionHash){ 
    	//console.log("error_1 : "+ error) 
    	//console.log("transactionHash : "+ transactionHash) 
    })
		/*.on('error', function(error){ 
			console.log("error_2 : "+ error) 
		})
		.on('transactionHash', function(transactionHash){ 
			console.log("transactionHash : "+ transactionHash) 
		})*/
		.on('receipt', function(receipt){
			addressSmartContract = receipt.contractAddress
			allTransactions.push(receipt.transactionHash)
			//alert(addressSmartContract)
		   	//console.log(receipt.contractAddress) // contains the new contract address
		})
		/*.on('confirmation', function(confirmationNumber, receipt){ 
			console.log("confirmationNumber : "+ confirmationNumber) 
			console.log("receipt : ")
			console.log(receipt)

		})
		.then(function(newContractInstance){
		    console.log(newContractInstance.options.address) // instance with the new contract address
		});//()=>{});*/

//    console.log(contratDeploie.options)
	buildNameFunctionWithParam_JSON();
}


const initialisation = async() =>{
    allAccounts = await web3.eth.getAccounts();
    let plateau = document.getElementById("jeu"); 
    plateau.innerHTML += "<tr class=\"user_main player_0\"><td class=\"name\">User main</td><td class=\"adresse\">"+allAccounts[0]+"</td><td class=\"numMagic\"><center>"+nombreMagique+"</center></td><td colspan=\"3\"></td></tr>";
    
    for(let i =2; i <= allAccounts.length; ++i){
		plateau.innerHTML += "<tr class=\"user_player player_"+(i-1)+"\"><td class=\"name\">User "+(i-1)+"</td><td class=\"adresse\">"+allAccounts[i-1]+"<td class=\"numMagic\" ><center>???</center></td><td class=\"proposition\"><input id=\"proposition_"+(i-1)+"\" name=\"proposition_"+(i-1)+"\" ></input><button type=\"button\" onclick=\"propositionPlayer("+(i-1)+")\">Proposition</button></td><td><div id=\"liste_nombre_"+(i-1)+"\"></div></td><td class=\"demandeChiffre\">Adresse : <input id=\"demandeListe_"+i+"\" name=\"demandeListe_"+(i-1)+"\" ></input><button type=\"button\" onclick=\"demandeChiffre("+i+")\">Demande idée(s)</button></td></tr>"
		//console.log(i);																																			// style=\"background-color:red;\"
	}
    deploiementContract();
    //test_multiple_param();
}


const test_multiple_param = async()=>{

	dataInput = '0x00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000021';
	//dataInput = '0x4d6c3b7500000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000021';
	//_parametre = dataInput.replace(dataInput.substring(2,10),'');

	//_parametre = await web3.eth.abi.decodeParameter(nomFonctionAvecParam_JSON[i][2],_parametre);
	//_parametre = await web3.eth.abi.decodeParameter(['int256', 'int256'],dataInput);
	//_parametre = await web3.eth.abi.decodeParameters(['string', 'uint256'], '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000ea000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000');
	_parametre = await web3.eth.abi.decodeParameters(['int256', 'int256'], dataInput);

	//ajoutHTML += "<b>Fonction : </b>" +nomFonctionAvecParam_JSON[i][1]+"<br>"
	console.log(_parametre)
}



function adresseContrat(){
	addressSmartContract = document.getElementById("adresse_contrat").value;
	//alert(addressContrat);
}



const propositionPlayer = async(indice) => {

	let contrat = new web3.eth.Contract(JSON.parse(abi),addressSmartContract); 
	let proposition = document.getElementById("proposition_"+indice).value;
	//alert(proposition)
	let parameter={
		from: allAccounts[indice],
		gas: web3.utils.toHex(2100000),
	};
	//alert("avt")
	let transactionHash_id; 
	// Pour faire une transaction 
	//await contrat.methods.proposeSolution(proposition,proposition-1).send(parameter).then(receipt =>{
	await contrat.methods.proposeSolution(proposition).send(parameter).then(receipt =>{
		//transactionHash_id = receipt.transactionHash
		//console.log(receipt)
		allTransactions.push(receipt.transactionHash)
		/*transactionHash=retur.transactionHash
		alert(receipt.transactionHash)
		console.log(retur)*/
		//console.log(retur)
	})
	
	// Pour savoir si c'est bon ou non 
	//await contrat.methods.proposeSolution(proposition,proposition-1).call().then(receipt =>{
	await contrat.methods.proposeSolution(proposition).call().then(receipt =>{
		if(receipt == true){
			alert("C'est gagné !")
		}else{
			// Dommage 
		}
		//console.log(receipt)
	})
	/*let transactionHash = await web3.eth.getTransaction(transactionHash_id)
	allTransactions.push(transactionHash.input)
	console.log("Ok")*/
	/*let transactionHash = await web3.eth.getTransaction(transactionHash)
	allTransactions.push(transactionHash.input)
	console.log(t.input)	*/
	//let res = await web3.eth.getTransaction(allTransactions[allTransactions.length-1])
	//console.log(res)
}	


const demandeChiffre = async(indice)=>{
	//try{
		let contrat = new web3.eth.Contract(JSON.parse(abi),addressSmartContract); 
		let adressCall = document.getElementById("demandeListe_"+indice).value;
		let listeNombre = document.getElementById("liste_nombre_"+(indice-1));
		let ajoutHTMLplus = "<p class\"plus\"> - : "
		let ajoutHTMLmoins = "<p class\"moins\">+ :";

		await contrat.methods.getSolution(adressCall).call().then(receipt =>{
			//console.log("Reponse de getSolution : ")
			//console.log(receipt)
			for(let i =0; i < receipt.length; ++ i){
				if(receipt[i][1]=='+'){
					ajoutHTMLplus+=" "+receipt[i][0]
				}else{
					ajoutHTMLmoins+=" "+receipt[i][0]
				}
			}
			ajoutHTMLplus +="</p>";
			ajoutHTMLmoins +="</p>";
			listeNombre.innerHTML+=ajoutHTMLplus+ajoutHTMLmoins
		})
	/*}catch(err){
		alert("Il n'y a pas de chiffre à cette adresse ;)");
	}*/
}

const miseAjourTransaction = async() => {
	let transaction = document.getElementById("transactions");
	let ajoutHTML;

	transaction.innerHTML=""

	for(let i =0; i < allTransactions.length; ++i){
		let dataInputDechiffre="<br><b>input : </b>";
		let res = await web3.eth.getTransaction(allTransactions[i])			
		let _parametre="/!_?_!\\"

			ajoutHTML ="<tr>"
			ajoutHTML +="<td><b>Num :</b>"+res.blockNumber+"<br><b>hashBlock :</b>"+res.hash+"<br><b>from :</b>"+res.from+"<br><b>to :</b>"+res.to+"<br><b>input :</b>";
			
			let dataInput = res.input; 
        	if(dataInput.length > 80){dataInput = dataInput.substring(0,35)+'[...]'+dataInput.substring(dataInput.length-35)}
			ajoutHTML +=dataInput+"<br></td>";

			//transaction.innerHTML+=dataInput+"<br></td>"


            let a = allAccounts.indexOf(res.to)

            ajoutHTML +="<td><b>De : </b>"
            let de = allAccounts.indexOf(res.from)

            ajoutHTML +="User "+de+"<br>"

            if(res.to==addressSmartContract){
            	dataInput = res.input
            	
            	let signatureFonction = dataInput.substring(0,10)

            	for(let i = 0; i < nomFonctionAvecParam_JSON.length; ++i){
            		if(nomFonctionAvecParam_JSON[i][0]==signatureFonction){
            			// ajout 
            			_parametre = dataInput.replace(dataInput.substring(2,10),'');
            			//alert(_parametre)

            			//_parametre = await web3.eth.abi.decodeParameter(nomFonctionAvecParam_JSON[i][2],_parametre);
            			
						//dataInput = '0x00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000021';
						//console.log(nomFonctionAvecParam_JSON[i][2])
						if(nomFonctionAvecParam_JSON[i][2].length==0){
							//alert("0")
							//_parametre = "No param"
							dataInputDechiffre +="No param"
						}else if(nomFonctionAvecParam_JSON[i][2].length==1){
							///alert("1")	
							_parametre = await web3.eth.abi.decodeParameter(nomFonctionAvecParam_JSON[i][2][0],_parametre);
							dataInputDechiffre +=_parametre
						}else{
							//alert(_parametre)
							_parametre = await web3.eth.abi.decodeParameters(nomFonctionAvecParam_JSON[i][2],_parametre);
							for(let _liste_param = 0; _liste_param <_parametre.__length__ ; _liste_param++){
			            		dataInputDechiffre+=_parametre[_liste_param] + " ;"
			            	}
						}
            				
            			ajoutHTML += "<b>Fonction : </b>" +nomFonctionAvecParam_JSON[i][1]+"<br>"
            			
            			//console.log(_parametre)
            			break;
            		}
            	}

            	//let _parametre = await web3.eth.abi.decodeParameter('uint',tmp)
            	
            	//dataInputDechiffre +=_parametre

        	}else if(res.to==null){
        		dataInputDechiffre +=dataInput
        	} 
            /*if(a==-1){
            	dataInputDechiffre=dataInput
            }else{
				let w = await web3.eth.abi.encodeParameter('uint256', dataInput);
				dataInputDechiffre=w
				alert(w)
            }*/

            ajoutHTML +=dataInputDechiffre+"<br><br><b>À : </b>";
            if(res.to==addressSmartContract){a="Contrat"}else if(a==-1){a="Déploiement contrat"} 
            ajoutHTML +=a+"<br></td></tr>"

            transaction.innerHTML+=ajoutHTML;
	}

}




function buildNameFunctionWithParam_JSON(){
	
	let json = JSON.parse(abi)

	for(let _function=0; _function < json.length; ++_function){
		let name=''
		let argument=[];//='['

		if(json[_function]["type"]==="function"){
			name +=json[_function]["name"]+'('
			let length = json[_function]["inputs"].length
			for(let _parametre=0; _parametre <length-1; ++_parametre){
				let param =json[_function]["inputs"][_parametre]["type"]
				name+=param+","
				argument.push(param)/*'\''+param+ '\','*/
				//name+=" "
				//name+=json[_function]["inputs"][_parametre]["name"]
				//name+=
			}
			if(0 < length){
				let param = json[_function]["inputs"][length-1]["type"]
				name+=param
				///if(length==1){argument+='\'';}
				argument.push(param)//'\''+param+ '\''
			}
			name+=')'
			//argument+=']'

			//alert(argument)
			nomFonctionAvecParam_JSON.push([web3.eth.abi.encodeFunctionSignature(name),name,argument])
		}
	}
	//console.log(nomFonctionAvecParam_JSON)
}



initialisation();

//Fonction avec 2 param 
/*let bytecode = '608060405234801561001057600080fd5b50604051610b0f380380610b0f83398181016040528101906100329190610054565b806000819055505061009e565b60008151905061004e81610087565b92915050565b60006020828403121561006657600080fd5b60006100748482850161003f565b91505092915050565b6000819050919050565b6100908161007d565b811461009b57600080fd5b50565b610a62806100ad6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80634d6c3b751461003b578063de4611e71461006b575b600080fd5b610055600480360381019061005091906106b5565b61009b565b6040516100629190610870565b60405180910390f35b6100856004803603810190610080919061068c565b610360565b604051610092919061084e565b60405180910390f35b6000805483131561018657600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180604001604052808581526020016040518060400160405280600181526020017f2b00000000000000000000000000000000000000000000000000000000000000815250815250908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000155602082015181600101908051906020019061017e9291906105bf565b505050610355565b60005483121561027057600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180604001604052808581526020016040518060400160405280600181526020017f2d0000000000000000000000000000000000000000000000000000000000000081525081525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010190805190602001906102689291906105bf565b505050610354565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180604001604052808581526020016040518060400160405280600181526020017f3d0000000000000000000000000000000000000000000000000000000000000081525081525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010190805190602001906103489291906105bf565b5050506001905061035a565b5b600090505b92915050565b60606000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080549050116103e7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103de9061088b565b60405180910390fd5b600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020829080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b828210156105b45783829060005260206000209060020201604051806040016040529081600082015481526020016001820180546105239061098c565b80601f016020809104026020016040519081016040528092919081815260200182805461054f9061098c565b801561059c5780601f106105715761010080835404028352916020019161059c565b820191906000526020600020905b81548152906001019060200180831161057f57829003601f168201915b505050505081525050815260200190600101906104e6565b505050509050919050565b8280546105cb9061098c565b90600052602060002090601f0160209004810192826105ed5760008555610634565b82601f1061060657805160ff1916838001178555610634565b82800160010185558215610634579182015b82811115610633578251825591602001919060010190610618565b5b5090506106419190610645565b5090565b5b8082111561065e576000816000905550600101610646565b5090565b600081359050610671816109fe565b92915050565b60008135905061068681610a15565b92915050565b60006020828403121561069e57600080fd5b60006106ac84828501610662565b91505092915050565b600080604083850312156106c857600080fd5b60006106d685828601610677565b92505060206106e785828601610677565b9150509250929050565b60006106fd8383610811565b905092915050565b6000610710826108bb565b61071a81856108de565b93508360208202850161072c856108ab565b8060005b85811015610768578484038952815161074985826106f1565b9450610754836108d1565b925060208a01995050600181019050610730565b50829750879550505050505092915050565b61078381610923565b82525050565b6107928161092f565b82525050565b60006107a3826108c6565b6107ad81856108ef565b93506107bd818560208601610959565b6107c6816109ed565b840191505092915050565b60006107de601b83610900565b91507f496c206e2779206120706173206465207265706f6e7365203a292000000000006000830152602082019050919050565b60006040830160008301516108296000860182610789565b50602083015184820360208601526108418282610798565b9150508091505092915050565b600060208201905081810360008301526108688184610705565b905092915050565b6000602082019050610885600083018461077a565b92915050565b600060208201905081810360008301526108a4816107d1565b9050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b600061091c82610939565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60005b8381101561097757808201518184015260208101905061095c565b83811115610986576000848401525b50505050565b600060028204905060018216806109a457607f821691505b602082108114156109b8576109b76109be565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b610a0781610911565b8114610a1257600080fd5b50565b610a1e8161092f565b8114610a2957600080fd5b5056fea26469706673582212203dd2c81ba695895064b23e0def52b9210b0e1c736916fa19d609a164a5f4502e64736f6c63430008000033'
let abi = '[{"inputs": [{"internalType": "int256","name": "_nombreMagique","type": "int256"}],"stateMutability": "nonpayable","type": "constructor"},{"inputs": [{"internalType": "address","name": "_user","type": "address"}],"name": "getSolution","outputs": [{"components": [{"internalType": "int256","name": "propose","type": "int256"},{"internalType": "string","name": "pme","type": "string"}],"internalType": "struct nombreMagique.Reponse[]","name": "","type": "tuple[]"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "int256","name": "_solution","type": "int256"},{"internalType": "int256","name": "param_inutile_test","type": "int256"}],"name": "proposeSolution","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"}]'
*/
// Param uint -> int 
let bytecode = '608060405234801561001057600080fd5b50604051610d12380380610d128339818101604052810190610032919061007a565b80600081905550506100a7565b600080fd5b6000819050919050565b61005781610044565b811461006257600080fd5b50565b6000815190506100748161004e565b92915050565b6000602082840312156100905761008f61003f565b5b600061009e84828501610065565b91505092915050565b610c5c806100b66000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063de4611e71461003b578063eff3baa71461006b575b600080fd5b6100556004803603810190610050919061060c565b61009b565b60405161006291906107e1565b60405180910390f35b6100856004803603810190610080919061082f565b6102fa565b6040516100929190610877565b60405180910390f35b60606000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054905011610122576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610119906108ef565b60405180910390fd5b600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020829080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b828210156102ef57838290600052602060002090600202016040518060400160405290816000820154815260200160018201805461025e9061093e565b80601f016020809104026020016040519081016040528092919081815260200182805461028a9061093e565b80156102d75780601f106102ac576101008083540402835291602001916102d7565b820191906000526020600020905b8154815290600101906020018083116102ba57829003601f168201915b50505050508152505081526020019060010190610221565b505050509050919050565b600080548213156103de57600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180604001604052808481526020016040518060400160405280600181526020017f2b0000000000000000000000000000000000000000000000000000000000000081525081525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010190816103d69190610b54565b50505061059f565b6000548212156104c157600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180604001604052808481526020016040518060400160405280600181526020017f2d0000000000000000000000000000000000000000000000000000000000000081525081525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010190816104b99190610b54565b50505061059e565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180604001604052808481526020016040518060400160405280600181526020017f3d0000000000000000000000000000000000000000000000000000000000000081525081525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010190816105929190610b54565b505050600190506105a4565b5b600090505b919050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006105d9826105ae565b9050919050565b6105e9816105ce565b81146105f457600080fd5b50565b600081359050610606816105e0565b92915050565b600060208284031215610622576106216105a9565b5b6000610630848285016105f7565b91505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000819050919050565b61067881610665565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156106b857808201518184015260208101905061069d565b60008484015250505050565b6000601f19601f8301169050919050565b60006106e08261067e565b6106ea8185610689565b93506106fa81856020860161069a565b610703816106c4565b840191505092915050565b6000604083016000830151610726600086018261066f565b506020830151848203602086015261073e82826106d5565b9150508091505092915050565b6000610757838361070e565b905092915050565b6000602082019050919050565b600061077782610639565b6107818185610644565b93508360208202850161079385610655565b8060005b858110156107cf57848403895281516107b0858261074b565b94506107bb8361075f565b925060208a01995050600181019050610797565b50829750879550505050505092915050565b600060208201905081810360008301526107fb818461076c565b905092915050565b61080c81610665565b811461081757600080fd5b50565b60008135905061082981610803565b92915050565b600060208284031215610845576108446105a9565b5b60006108538482850161081a565b91505092915050565b60008115159050919050565b6108718161085c565b82525050565b600060208201905061088c6000830184610868565b92915050565b600082825260208201905092915050565b7f496c206e2779206120706173206465207265706f6e7365203a29200000000000600082015250565b60006108d9601b83610892565b91506108e4826108a3565b602082019050919050565b60006020820190508181036000830152610908816108cc565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061095657607f821691505b6020821081036109695761096861090f565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302610a007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826109c3565b610a0a86836109c3565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000610a51610a4c610a4784610a22565b610a2c565b610a22565b9050919050565b6000819050919050565b610a6b83610a36565b610a7f610a7782610a58565b8484546109d0565b825550505050565b600090565b610a94610a87565b610a9f818484610a62565b505050565b5b81811015610ac357610ab8600082610a8c565b600181019050610aa5565b5050565b601f821115610b0857610ad98161099e565b610ae2846109b3565b81016020851015610af1578190505b610b05610afd856109b3565b830182610aa4565b50505b505050565b600082821c905092915050565b6000610b2b60001984600802610b0d565b1980831691505092915050565b6000610b448383610b1a565b9150826002028217905092915050565b610b5d8261067e565b67ffffffffffffffff811115610b7657610b7561096f565b5b610b80825461093e565b610b8b828285610ac7565b600060209050601f831160018114610bbe5760008415610bac578287015190505b610bb68582610b38565b865550610c1e565b601f198416610bcc8661099e565b60005b82811015610bf457848901518255600182019150602085019450602081019050610bcf565b86831015610c115784890151610c0d601f891682610b1a565b8355505b6001600288020188555050505b50505050505056fea2646970667358221220e354eb92f31c9b0432e00db7e5e37f529f37371e766a5bd823dd766e89e5406c64736f6c63430008120033';
let abi = '[{"inputs": [{"internalType": "int256","name": "_nombreMagique","type": "int256"}],"stateMutability": "nonpayable","type": "constructor"},{"inputs": [{"internalType": "address","name": "_user","type": "address"}],"name": "getSolution","outputs": [{"components": [{"internalType": "int256","name": "propose","type": "int256"},{"internalType": "string","name": "pme","type": "string"}],"internalType": "struct nombreMagique.Reponse[]","name": "","type": "tuple[]"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "int256","name": "_solution","type": "int256"}],"name": "proposeSolution","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"}]';
