import { Actor, CollisionType, Color, DisplayMode, Engine, Font, FontUnit, Label, Loader, Sound, Text, vec, } from "excalibur"

// 1 - Criar uma instancia de Engine, que representa o jogo
const game = new Engine({
	width: 1200,
	height: 1000
})
const sound = new Sound('./audios/556 Single MP3.mp3');
const sound2 = new Sound('./audios/FF.mp3');
const sound3 = new Sound('./audios/wilhelmscream.mp3');
const loader = new Loader([sound, sound2]);
await game.start(loader);



// 2 - Criar barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40,	// game.drawHeight = altura do game
	width: 177,
	height: 50,
	color: Color.Chartreuse
})

// Define o tipo de colisão da barra
// CollisionType.Fixed = significa que ele não irá se "mexer" quando colidir
barra.body.collisionType = CollisionType.Fixed

// Insere o Actor barra - player, no game
game.add(barra)

// 3 - Movimentar a barra de acordo com a posição do mouse
game.input.pointers.primary.on("move", (event) => {
	// Faz a posição x da barra, ser igual a posição x do mouse
	barra.pos.x = event.worldPos.x
})

// 4 - Criar o Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive


// 5 - Criar movimentação da bolinha
const velocidadeBolinha = vec(3300, 3000)

// Após 1 segundo (1000 ms), define a velocidade da bolinha em x = 100 e y = 100
setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)

// 6 - Fazer bolinha rebater na parede
bolinha.on("postupdate", () => {
	// Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x
	}

	// Se a bolinha colidir com o lado direito
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadeBolinha.x
	}

	// Se a bolinha colidir com a parte superior
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y
	}

	// Se a bolinha colidir com a parte inferior
	// if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
	// 	bolinha.vel.y = -velocidadeBolinha.y
	// }
})

// Insere bolinha no game
game.add(bolinha)


// 7 - Criar os blocos
// Configurações de tamanho e espaçamento dos blocos
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Black, Color.White, Color.Red]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
// const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

//Render de 3 linhas

for(let j = 0; j < linhas; j++) {

	//Render de 5 blocos
	
	for(let i = 0; i < colunas; i++) {
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]
			})
		)
	}
}


listaBlocos.forEach( bloco => {
	bloco.body.collisionType = CollisionType.Active
	game.add(bloco)
})

// Adicionando Pontuação
let pontos = 0;


const textPontos = new Label({
	text: pontos.toString(),
	font: new Font({
		size: 40,
		color: Color.White,
		strokeColor: Color.Black,
		unit: FontUnit.Px,
	}),
	pos: vec(600, 500)
})

game.add(textPontos)


// const textoPontos = new Text({
// 	text: "Hello World",
// 	font: new Font ({size: 30})
// })

// const objetoTexto = new Actor({
// 	x: game.drawWidth - 80,
// 	y: game.drawHeight - 15
// })

// objetoText0.graphics.use(pontos)

// game.add(objetoTexto)

let colidindo: boolean = false

bolinha.on("collisionstart", async (event) => {

	if	(listaBlocos.includes(event.other)) {

		event.other.kill()

		sound3.play(1);

		pontos++

		textPontos.text = pontos.toString()

		console.log(pontos);
		
		sound.play(1);

		if (pontos == 15){
			sound2.play(1)
			alert("Vitória!")

		}

		
	}

	let interceccao = event.contact.mtv.normalize()


	if (!colidindo) {
		colidindo = true

		if (Math.abs(interceccao.x) > Math.abs(interceccao.y) ) {
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}
})

bolinha.on("collisionend", () => {
	colidindo = false
})

bolinha.on("exitviewport", () => {

	window.location.reload()
 })

// Inicia o game
game.start()
