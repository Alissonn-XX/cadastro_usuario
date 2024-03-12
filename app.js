import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getFirestore, collection,addDoc,serverTimestamp,updateDoc,doc,deleteDoc,onSnapshot} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBr_Zk3oPChVrUEEMZ6TSqFCxahLEIvjNQ",
  authDomain: "conhecendo-firebase-54fef.firebaseapp.com",
  projectId: "conhecendo-firebase-54fef",
  storageBucket: "conhecendo-firebase-54fef.appspot.com",
  messagingSenderId: "277838327132",
  appId: "1:277838327132:web:3350e0b3b8bdbba951e599",
  measurementId: "G-S1V4GF6MD1"
};


const app = initializeApp(firebaseConfig);
const bd = getFirestore(app)
const collectionsBd = collection(bd, 'usuarios')
const formUsuarios = document.querySelector('[data-js="inserir-usuarios"]')
const cep = document.querySelector('[data-js-endereco="cep"]')
const btnBuscarCep = document.querySelector('[data-js-endereco="consulta-endereco-cadastro"]')
const tabela = document.querySelector('[data-js="table-usuario"] tbody')
const container = document.querySelector('[data-js="container"]')
const btnMinimizar = document.querySelector('[data-js="minimizar"]')
let arr = []

const formatCepIntercafe = (strCep) => {
  let cepFormatado = '';
   if(strCep.length > 0 ){
    cepFormatado = strCep.replace(/\D/g, '')
    return  cepFormatado
   }
   
   return cepFormatado
} 

const stateObjCep = (() => {

  let objInitEndereco = {
    bairro: '',
    cep: '',
    complemento: '',
    localidade: '',
    logradouro: '',
    numero: '',
    tipoLogradouro: '',
    uf: ''
  }
   
  return{
    
    getObjCep:() => objInitEndereco,
  
   
    setObjCep:(obj={})=>{

      if(!obj.hasOwnProperty('cep')){
        return objInitEndereco
      }
      
      return  objInitEndereco = Object.entries(obj).reduce((acc, [chave, valor])=>{
              acc[chave] = valor
              return acc
          },{})
    
      },

    setPropriedade:(propObj,valor)=>{
          if(objInitEndereco.hasOwnProperty(propObj)){
            objInitEndereco[propObj] = valor
          }
           
      }
  }

   
})()

 const buscarCepFetch = async (cepStr) =>{
  try{
    const response = await fetch(`https://viacep.com.br/ws/${cepStr}/json/`)
    const data = await response.json()
    const objFormatado = Object.entries(data)
      .filter(([chave, _]) => chave !== 'gia' && chave !== 'ddd' && chave !== 'siafi' &&  chave !== 'ibge')
      .reduce(( acc, [chave, valor])=>{
         acc[chave] = valor

         return acc
      },{})
    return objFormatado
  }catch(erro){
    let objInitEndereco = {
      bairro: '',
      cep: '',
      complemento: '',
      localidade: '',
      logradouro: '',
      numero: '',
      tipoLogradouro: '',
      uf: ''
    }
      
    return objInitEndereco
  }
}

const cepFormatInterface = (input)=>{
  if(input.value || input.value.lenght < 8){
    return
  }
  input.onblur =()=>{
    let cepForm = input.value
    input.value = cepForm.replace(/\D/g, '')
         .replace(/(\d{5})(\d)/, '$1-$2')
         .replace(/(-\d{3})\d+?$/, '$1')
  }
}

btnBuscarCep.addEventListener('click',async () =>{
  const bairro = document.querySelector('[data-js-endereco="bairro"]') 
  const cidade = document.querySelector('[data-js-endereco="localidade"]')
  const estado = document.querySelector('[data-js-endereco="uf"]')
  const logradouro = document.querySelector('[data-js-endereco="logradouro"]')
  let inputVazios = []
  let objCEP = stateObjCep
  
      for(let i= 0; i < arr.length; i++){
        const classInput = arr[i].classList.contains('border','border-2','border-danger')
        if(arr[i].dataset.hasOwnProperty('jsEndereco')){  
          if(arr[i].tagName === 'INPUT' && classInput){
            inputVazios.push(arr[i])
          }
        }
      }

      if(cep.value.length > 0){
        objCEP.setObjCep(await buscarCepFetch(formatCepIntercafe(cep.value)))
      }else{
        bairro.value =  '' 
        cidade.value =  ''
        estado.value =  ''
        logradouro.value = ''
        alert('Endereço não encontrato. Certifique-se que o CEP está correto')
      }

  const removeClassInputVazio = (arr)=>{
    arr.filter((input)=>{
        let classInput = input.classList.contains('border','border-2','border-danger')
          if(classInput && input.value.length > 0){
            return input.classList.remove('border','border-2','border-danger')
          }
      })
  }
    
   bairro.value = objCEP.getObjCep()[bairro.dataset.jsEndereco]
   cidade.value = objCEP.getObjCep()[cidade.dataset.jsEndereco]
   estado.value = objCEP.getObjCep()[estado.dataset.jsEndereco]
   logradouro.value = objCEP.getObjCep()[logradouro.dataset.jsEndereco]
   removeClassInputVazio(inputVazios)
})


// const pagIntefaceInsercao = (arrObj) =>{
  
//   for(let i=0; i < arrObj.length; i++){
//     let objTag = arrObj[i]
//       const linhaExistente = tabela.querySelector(`tr[data-delete="${objTag.id}"]`);
//       if(linhaExistente){
//         return 
//       }

    
//     const linhaTabela = document.createElement('tr')
//     const btnCelulaDelete = document.createElement('button')
//     const btnCelulaAltera = document.createElement('button')
//     const celulaTabelaName = document.createElement('td')
//     const celulaTabelaIdade = document.createElement('td')
//     const celulaTabelaCidade = document.createElement('td')
//     const celulaTabelaId = document.createElement('td')
//     const celulaTabelaBTN = document.createElement('td')

    
//       linhaTabela.setAttribute('data-delete', objTag.id)
//       celulaTabelaBTN.classList.add('celulaBtn')
//       btnCelulaDelete.setAttribute('class','btn btn-outline-danger excluir')
//       btnCelulaAltera.setAttribute('class','btn btn-info alterar')
//       btnCelulaDelete.setAttribute('data-delete', objTag.id)
//       btnCelulaAltera.setAttribute('data-alterar', objTag.id)
//       celulaTabelaName.setAttribute('data-js','nome')
//       celulaTabelaIdade.setAttribute('data-js','sobrenome')
//       celulaTabelaCidade.setAttribute('data-js','idade')
//       celulaTabelaId.setAttribute('data-js','sexo')
      
      
//       btnCelulaDelete.textContent = 'Excluir'
//       btnCelulaAltera.textContent = 'Alterar'
//       celulaTabelaName.textContent = objTag.nome.toUpperCase()
//       celulaTabelaIdade.textContent = objTag.idade
//       celulaTabelaCidade.textContent = objTag.sobrenome.toUpperCase()
//       celulaTabelaId.textContent = objTag.id
//       celulaTabelaBTN.append(btnCelulaDelete,btnCelulaAltera)

//       linhaTabela.append(celulaTabelaName,celulaTabelaIdade,celulaTabelaCidade,celulaTabelaBTN)
      
//       tabela.append(linhaTabela)

//   }
    
// }

// const formatandoData = (strData) =>{
//   const opcoes = {weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',timezone: 'UTC',};
//   let data = new Date(strData).toLocaleString('pt-BR',opcoes)
 
//   return data
// }

// const novoArrObjCollection = (arrDocs) =>{
//   let novoArrObj =  arrDocs.map(({nome,sobrenome,sexo,idade,horaCriacao,id,endereco})=>{
//     const propriedadeStr = 'stringValue';
//     const propriedadeInt = 'integerValue';  
//     return{
//       id:id,
//       nome: nome[propriedadeStr],
//       idade: parseInt(idade[propriedadeInt]),
//       sobrenome: sobrenome[propriedadeStr],
//       sexo:sexo[propriedadeStr],
//       horaCriacao: formatandoData(horaCriacao['timestampValue']),
//       endereco:{
//         cep: parseInt(endereco.cep[propriedadeStr]),
//         bairro: endereco.bairro[propriedadeStr],
//         cidade: endereco.cidade[propriedadeStr],
//         estado: endereco.estado[propriedadeStr],
//         numero: parseInt(endereco.numero[propriedadeInt]),
//         logradouro: endereco.logradouro[propriedadeStr],
//         tipoLogradouro: endereco.tipoLogradouro[propriedadeStr]
//       }
//     }    
//   })
    
//   pagIntefaceInsercao(novoArrObj)
// }

// onSnapshot(collectionsBd,(dados)=>{
//   console.log('onSnapshot rodou')
//   if(!dados.metadata.hasPendingWrites){
//     const {docs} = dados

//     const arrObjDestructorDocs = docs.map((docItem)=>{
//       const {nome,sobrenome,sexo,idade,horaCriacao} = docItem._document.data.value.mapValue.fields
//       const endereco = docItem._document.data.value.mapValue.fields.endereco.mapValue.fields
//       const id = docItem.id
//      return {nome,sobrenome,sexo,idade,horaCriacao,id,endereco}
//     })
//    novoArrObjCollection(arrObjDestructorDocs)
//   }
  
// })


const isValorExisti = function isValorExisti(obj){
  let formatObjUsuario = {
    ...obj['usuario'],
    ...obj['endereco']
  };
   
 

  if(document.querySelector('.modal-dialog')){
    return
  }
  
  
  let novoObjPropVazia = Object.entries(formatObjUsuario)
    .reduce((acc, arrProp)=>{
      let [chave, valor] = arrProp
          if(typeof arrProp === 'object' && !valor){
              acc[chave]= valor
          }
        return acc
  },{})
  

  for(let i of Object.values(novoObjPropVazia)){
    let notVazio = Object.values(novoObjPropVazia).length <= 0
    if(!i || notVazio){
      novoObjPropVazia.vazio = true
    }
  }
  
  if(novoObjPropVazia.vazio){
    container.insertAdjacentElement('afterbegin',modalInfo(novoObjPropVazia))
  }

  
  return  Object.entries(novoObjPropVazia)
             .map(([chave,_])=>{
  
        return chave
      })
   
}

//MODAL EM CASO DE ALGUM CAMPO VAZIO NO FORMULÁRIO
const modalInfo = (valor) =>{

  valor = Object.entries(valor)
  .map(([chaves,valores])=>{
     if(!valores && valores !== 'vazio'){
      return chaves
     }
  }).filter(chave => chave)

  let camposVasios = valor.reduce((acc,campos)=>{
    let texto = ',' + campos
    return acc += `${texto}\n`
  },'')

  camposVasios = camposVasios.replace(/(^,|,$)/g, '').trim()
  camposVasios+='.'
  let camposQuant= valor.length || 0;
  
  const divModalConteiner = document.createElement('div')
  const divModalChild = document.createElement('div')
  const divModalHeader = document.createElement('div')
  const tituloModalHeader = document.createElement('h5')
  const paragraModal = document.createElement('p')
  const divModalBody = document.createElement('div')
  const divModalFooter = document.createElement('div')
  const btnCloseModalOk = document.createElement('button')


    tituloModalHeader.textContent = 'Certifique-se que não existe nenhum campo vazio!'
    paragraModal.textContent = `Erro ${camposQuant > 1 ? 'campos' : 'campo'} em branco: ${camposVasios}`
    btnCloseModalOk.textContent = 'Continuar'

    divModalConteiner.classList.add('modal-dialog', 'modal-dialog-centered')
    divModalHeader.classList.add('modal-header')
    divModalChild.classList.add('modal-content')       
    tituloModalHeader.classList.add('modal-title','modal-cor-fonte')
    paragraModal.classList.add('modal-cor-fonte')
    divModalBody.classList.add('modal-body')
    divModalFooter.classList.add('modal-footer')
    btnCloseModalOk.classList.add('btn', 'btn-primary')

    btnCloseModalOk.setAttribute('type','button')

    btnCloseModalOk.addEventListener('click', ()=>{
        if(document.getElementsByClassName('modal-dialog')){
          document.querySelector('.modal-dialog').remove()
        }
    })

    divModalHeader.append(tituloModalHeader)
    divModalFooter.append(btnCloseModalOk)
    divModalBody.append(paragraModal)
    divModalChild.append(divModalHeader,divModalBody,divModalFooter)
    divModalConteiner.append(divModalChild)

  return divModalConteiner
}


const addClassDangerInputs = (arrInputsForm,forInputsVazios)=>{
  arrInputsForm.filter((inputVazio)=>{
    if(forInputsVazios.includes(inputVazio.name)){
        inputVazio.classList.add('border','border-2','border-danger')

        inputVazio.addEventListener('input', event=>{
        if(event.target.value.length > 0){
          inputVazio.classList.remove('border','border-2','border-danger')
          }else{
            inputVazio.classList.add('border','border-2','border-danger')
          }
        })  
      }
 })
}

const cadastroNovoUsuario = (isInputVazio,objCadastro)=>{
 if(!isInputVazio.includes('vazio')){
  addDoc(collectionsBd, objCadastro).then(doc =>{
      console.log("usuario criado", doc.id)
    }).catch(console.log)
  };

}

formUsuarios.addEventListener('submit',event=>{
  event.preventDefault()
  const nome = event.target.nome
  const sobrenome = event.target.sobrenome
  const idade = event.target.idade
  const sexo = event.target.sexo_select

 
  const cep = event.target.cep
  const bairro = event.target.bairro
  const cidade = event.target.localidade
  const estado = event.target.uf
  const tipo_logradouro = event.target.tipo_logradouro
  const numero = event.target.numero
  const logradouro = event.target.logradouro
  const complemento = event.target.complemento
  let objEndereco = stateObjCep;
  const arrInputsForm = [
    nome,sobrenome,idade,sexo,
    cep,
    bairro,
    cidade,
    estado,
    tipo_logradouro,
    numero,
    logradouro,
    complemento
  ]
  
  arr = arrInputsForm

  objEndereco.setObjCep({
    cep: formatCepIntercafe(cep.value),
    bairro: bairro.value,
    localidade:cidade.value,
    uf: estado.value,
    tipo_logradouro:tipo_logradouro.value,
    numero: numero.value,
    logradouro: logradouro.value,
    complemento: complemento.value
  })

  let objCadastroUsuario={
   usuario:{
    nome: nome.value,
    sobrenome: sobrenome.value,
    idade:Number(idade.value),
    sexo_select:sexo.value,
    horaCriacao: serverTimestamp()
   }
   ,endereco: objEndereco.getObjCep()
  }

  if(document.querySelector('.modal-dialog')){
   return
 }  

 const forInputsVazios = isValorExisti(objCadastroUsuario);
 

 addClassDangerInputs(arrInputsForm,forInputsVazios)

 cadastroNovoUsuario(forInputsVazios,objCadastroUsuario)

})



// tabela.addEventListener('click',event=>{
//   let idDelete = event.target.dataset.delete
//   let idAlterar = event.target.dataset.alterar

//     if(idDelete){
//        const linhaTabela = document.querySelector(`[data-delete="${idDelete}"]`)

//         deleteDoc(doc(collectionsBd, idDelete))
//         linhaTabela.remove()
//     }

//   // if(idAlterar){
//   //  const linhaSelecionada = event.target.parentElement.parentElement
//   //  telaModalAlteracao()
//   //  buscarCep(idAlterar)
//   //  linhaSelecionada.addEventListener('dblclick',()=>{})
//   // }
   
   
// })


cepFormatInterface(cep)
