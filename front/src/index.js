console.log("eita")

const ip = 'localhost'
// const ip = '54.233.245.145'
var base_url = `http://${ip}:8080`;

function criarApostador() {
    // Obtém os dados do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;

    const novoApostador = {
        nome: nome,
        email: email,
        dataDeNascimento: '2002-02-01'
    };

    // Envia a requisição para criar o novo apostador
    fetch(`${base_url}/apostador`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoApostador),
    })
        .then(response => {
            if (response.ok) {
                response.json()
                    .then(apostadorCriado => location.reload())
            } else {
                response.text().then(alert)
            }
        })
        .catch(error => {
            console.log(error)
            alert('Erro ao criar apostador:', error)
        });
}

// OK 
function listarApostadores() {
    fetch(`${base_url}/apostador`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            const tabelaApostadores = document.getElementById('tabelaApostadores').querySelector('tbody');
            tabelaApostadores.innerHTML = '';

            // Preenche a tabela com os dados dinâmicos ao listar os apostadores
            data.forEach(apostador => {
                const newRow = tabelaApostadores.insertRow();

                newRow.insertCell(0).textContent = apostador.id;
                newRow.insertCell(1).textContent = apostador.nome;
                newRow.insertCell(2).textContent = apostador.email;
            });
        })
        .catch(error => console.error('Erro ao obter a lista de apostadores:', error));
}


function limparEditar() {
    document.getElementById('id_editar').value = "";
    document.getElementById('nome_editar').value = "";
    document.getElementById('email_editar').value = "";
}


function editarApostadorConfirmacao() {
    const id = document.getElementById('id_editar').value;
    const nome = document.getElementById('nome_editar').value;
    const email = document.getElementById('email_editar').value;

    const apostadorEditado = {
        nome: nome,
        email: email,
    };

    fetch(`${base_url}/apostador/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(apostadorEditado),
    })
        .then(response => {
            if (response.ok) {
                listarApostadores()
            } else {
                response.text().then(alert)
            }
        })
        .catch(error => console.error('Erro ao editar apostador:', error))
        .finally(limparEditar);
}

function deletarApostadorConfirmacao() {
    const id = document.getElementById('id_editar').value;

    if (!id) {
        alert("Digite um ID válido")
    } else {
        fetch(`${base_url}/apostador/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    console.log('Apostador deletado com sucesso');
                    listarApostadores();
                } else {
                    response.text().then(alert)
                }
            })
            .catch(error => console.error('Erro ao deletar apostador:', error))
            .finally(limparEditar)
    }
}




// Concursos


function limparInputsConcursos() {
    document.getElementById('nomeConcurso').value = "";
    document.getElementById('dataSorteio').value = "";
}

function listarConcursos() {
    fetch(`${base_url}/concurso`).
        then(response => response.json())
        .then(json => {
            const tabelaConcursos = document.getElementById('tableConcursos').querySelector('tbody');
            tabelaConcursos.innerHTML = '';
            console.log(json)
            json.forEach((concurso) => {
                const newRow = tabelaConcursos.insertRow();
                newRow.insertCell(0).textContent = concurso.id
                newRow.insertCell(1).textContent = concurso.nome
                newRow.insertCell(2).textContent = concurso.dataSorteio
                newRow.insertCell(3).textContent = concurso.status
                newRow.insertCell(4).textContent = concurso.numeroSorteado
            })
        })
        .catch(console.error)
}

function criarConcurso() {
    const nomeConcurso = document.getElementById('nomeConcurso').value;
    const dataSorteio = document.getElementById('dataSorteio').value;

    const novoConcurso = {
        nome: nomeConcurso,
        dataSorteio: dataSorteio,
    };

    fetch(`${base_url}/concurso`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoConcurso),
    })
        .then(response => {
            if (response.ok) {
                response.json()
                    .then(concursoCriado => {
                        console.log('Concurso criado com sucesso:', concursoCriado);
                        listarConcursos();
                    })
            } else {
                response.text().then(alert)
            }
        })
        .catch(error => console.error('Erro ao criar concurso:', error))
        .finally(limparInputsConcursos);
}

function cancelarConcurso() {
    const idConcursoCancelar = document.getElementById('idCancelarConcurso').value;
    console.log(idConcursoCancelar)
    fetch(`${base_url}/concurso/${idConcursoCancelar}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                console.log('Concurso cancelado com sucesso');
                listarConcursos();
            } else {
                console.error('Erro ao cancelar concurso');
            }
        })
        .catch(error => console.error('Erro ao cancelar concurso:', error))
        .finally(limparInputsConcursos);
}

function sortearVencedor() {
    const idConcurso = document.getElementById('idSortearVencedor').value;

    // Gera um número aleatório entre 1 e 100
    const numeroSorteado = Math.floor(Math.random() * 100) + 1;

    fetch(`${base_url}/concurso/${idConcurso}/sortear`, { method: 'PATCH' }).then(
        response => response.json()
    ).then(json => {
        let message = `Concurso sorteado! O numero sorteado foi ${json.concurso.numeroSorteado}.`
        console.log(json)
        if (json.concurso.vencedor) {
            message = message + ` O ganhador foi ${json.concurso.vencedor}`
        }
        alert(message)

        listarConcursos()
    }).catch((e) => alert("Falha ao sortear concurso", e))
        .finally(limparInputsConcursos)
}


// Apostas
function listarApostas() {
    fetch(`${base_url}/apostas`).then(
        response => response.json()
    ).then((json) => {
        const tableApostas = document.getElementById('tableApostas').querySelector('tbody');
        tableApostas.innerHTML = '';
        json.forEach((aposta) => {
            const newRow = tableApostas.insertRow();
            newRow.insertCell(0).textContent = aposta.id
            newRow.insertCell(1).textContent = aposta.nomeApostador
            newRow.insertCell(2).textContent = aposta.nomeConcurso
            newRow.insertCell(3).textContent = aposta.numeroApostado
            newRow.insertCell(4).textContent = aposta.status
        })
    })
}

function preencherSelectorsAposta() {
    fetch(`${base_url}/apostador`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const selecApostadores = document.getElementById('apostador')
            data.forEach(apostador => {
                const option = document.createElement('option')
                option.value = apostador.id
                option.innerHTML = apostador.nome
                selecApostadores.add(
                    option
                )
            })
        })
        .catch((e) => {
            console.error(e)
        })


    fetch(`${base_url}/concurso?status=EM_ABERTO`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const selecConcursos = document.getElementById('concurso')
            console.log(data)
            data.forEach(concurso => {
                const option = document.createElement('option')
                option.value = concurso.id
                option.innerHTML = concurso.nome
                selecConcursos.add(
                    option
                )
            })
        })
        .catch((e) => {
            console.error(e)
        })
}

function criarAposta() {
    const id_apostador = document.getElementById('apostador').value;   
    const id_concurso = document.getElementById('concurso').value;
    const numero = document.getElementById('numeroAposta').value;

    fetch(`${base_url}/apostador/${id_apostador}/apostar/${id_concurso}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({numero: numero}),
    }).then(res => {
        if (res.ok) {
            alert("Aposta feita com sucesso!")
            listarApostas()
        } else {
            res.text().then((e) => alert(e))
        }
    })
}

function limparCamposAposta()  {

}