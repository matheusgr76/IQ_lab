// Language: English (default) and Brazilian Portuguese. t('English text', args...) looks up the PT text; {0}, {1} are filled from args.
let LANG=/^pt/i.test(navigator.language||'')?'pt':'en';
const setLang=l=>{LANG=l==='pt'?'pt':'en';document.documentElement.lang=LANG==='pt'?'pt-BR':'en'};
function t(s,...a){const r=(LANG==='pt'&&PT[s])||s;return a.length?r.replace(/\{(\d)\}/g,(m,i)=>a[i]):r}
const PT={
// navigation and titles
'Home':'Início','Puzzles':'Desafios','Test':'Teste','Stats':'Estatísticas','More':'Mais','Full test':'Teste completo',
// home
'Streak {0}':'Sequência {0}','{0} answered':'{0} respondidas','Puzzle IQ':'QI dos desafios','last 20':'últimas 20','Train':'Treinar','Adaptive':'Adaptativo',
'Last {0}':'Último {0}','50 tasks · not taken yet':'50 tarefas · ainda não feito','Profile':'Perfil',
// puzzles page
'Session done':'Sessão concluída','{0} puzzles · {1} IQ':'{0} desafios · {1} de QI','Played':'Jogados','Solved':'Acertos',
'Right answers raise your IQ, wrong or timed-out ones lower it. Hard puzzles move it more. Do one or as many as you like; it saves after every answer.':'Respostas certas aumentam seu QI; erradas ou fora do tempo o diminuem. Desafios difíceis mexem mais. Faça um ou quantos quiser; tudo é salvo a cada resposta.',
'Start puzzle':'Iniciar desafio',
// test page
'Full IQ test':'Teste de QI completo',
"50 tasks, 10 per domain, easy to hard. Every question is timed; time's up counts as a miss. About 35–45 minutes. Sit somewhere quiet, no notes, no calculator. No feedback until the end.":'50 tarefas, 10 por domínio, do fácil ao difícil. Cada pergunta tem tempo; acabar o tempo conta como erro. Cerca de 35–45 minutos. Fique em um lugar silencioso, sem anotações nem calculadora. Sem feedback até o fim.',
'Start full test':'Iniciar teste completo','Latest result · {0}':'Último resultado · {0}','95% range {0}–{1}':'Intervalo de 95% {0}–{1}','History':'Histórico',
'range {0}–{1}':'intervalo {0}–{1}','{0} tasks':'{0} tarefas','No full tests yet.':'Nenhum teste completo ainda.',
// stats page
'Both':'Ambos','Puzzle IQ over time':'QI dos desafios ao longo do tempo','older':'antigo','latest':'recente','Full test scores':'Resultados dos testes completos',
'Bars: FSIQ. Whiskers: 95% range.':'Barras: QI total. Linhas: intervalo de 95%.','By domain':'Por domínio','Domain':'Domínio','Puzzle':'Desafio','Full':'Completo',
'Weak spots':'Pontos fracos','Answer a few questions and this table fills in: accuracy, difficulty level reached and speed for each question type.':'Responda algumas perguntas e esta tabela se preenche: acerto, nível de dificuldade atingido e velocidade por tipo de pergunta.',
'Type':'Tipo','Acc':'Acerto','Lvl':'Nív.','Time':'Tempo','Out':'Esgot.',
'Weakest first. Lvl is the average difficulty (1–5); in Puzzles, accuracy stays near 60% by design, so read Lvl. Faded rows have fewer than 5 answers.':'Mais fracos primeiro. Nív. é a dificuldade média (1–5); nos Desafios o acerto fica perto de 60% por construção, então leia o Nív. Linhas apagadas têm menos de 5 respostas.',
'Time of day':'Hora do dia','When':'Quando','Night 0–6':'Madrugada 0–6','Day 6–18':'Dia 6–18','Evening 18–24':'Noite 18–24',
'Excludes speed tasks. Compare only when both rows have 30+ answers.':'Exclui tarefas de velocidade. Compare apenas quando as linhas tiverem 30+ respostas.',
'Your data':'Seus dados','Import previous results':'Importar resultados anteriores','Bring in results exported from IQ Lab, from this or another phone.':'Traga resultados exportados do IQ Lab, deste ou de outro celular.',
'Answer a few puzzles to see your curve.':'Responda alguns desafios para ver sua curva.','Take the full test to see your scores here.':'Faça o teste completo para ver seus resultados aqui.',
// question types and domains
'Matrix':'Matrizes','Rotation':'Rotação','Number series':'Séries numéricas','Letter series':'Séries de letras','Ordering':'Ordenação','Logic':'Lógica',
'Digits forward':'Dígitos em ordem direta','Digits backward':'Dígitos em ordem inversa','Letter-number':'Letras e números','Symbol coding':'Codificação de símbolos','Symbol search':'Busca de símbolos',
'Vocabulary':'Vocabulário','Similarities':'Semelhanças','Knowledge':'Conhecimentos','Analogy':'Analogias','Verbal':'Verbal',
'Verbal Comprehension':'Compreensão Verbal','Visual Spatial':'Visuoespacial','Fluid Reasoning':'Raciocínio Fluido','Working Memory':'Memória de Trabalho','Processing Speed':'Velocidade de Processamento',
'Vocabulary, similarities, general knowledge, analogies.':'Vocabulário, semelhanças, conhecimentos gerais, analogias.','Matrix puzzles and mental rotation of shapes.':'Matrizes e rotação mental de formas.',
'Number series and logic problems.':'Séries numéricas e problemas de lógica.','Digits forward and backward, number-letter sequencing.':'Dígitos em ordem direta e inversa, sequência de letras e números.',
'Symbol coding and symbol search against the clock.':'Codificação e busca de símbolos contra o relógio.',
'Visual':'Visual','Fluid':'Fluido','Memory':'Memória','Speed':'Rapidez',
'Very superior range':'Faixa muito superior','Superior range':'Faixa superior','High average range':'Faixa média alta','Average range':'Faixa média','Low average range':'Faixa média baixa','Borderline range':'Faixa limítrofe','Extremely low range':'Faixa extremamente baixa',
// more page
'Language':'Idioma','Puzzle settings':'Configurações dos desafios','Time limits':'Limites de tempo','Countdown per question; time’s up counts as a miss':'Contagem regressiva por pergunta; acabar o tempo conta como erro',
'Time allowance':'Tempo concedido','Applies to puzzles and the full test':'Vale para os desafios e o teste completo','Relaxed':'Folgado','Standard':'Padrão','Strict':'Rígido',
'Feedback after each puzzle':'Feedback após cada desafio','Show IQ change and result':'Mostrar variação de QI e resultado','Show the correct answer':'Mostrar a resposta certa','After a miss':'Após um erro',
'Data':'Dados','Storage':'Armazenamento','Saved to your private cloud database':'Salvo no seu banco de dados privado na nuvem','Saved on this device only':'Salvo apenas neste aparelho','Cloud save failed; saved on this device':'Falha ao salvar na nuvem; salvo neste aparelho',
'Export':'Exportar','Copy everything as JSON (full backup)':'Copiar tudo como JSON (backup completo)','Copy':'Copiar','Copied':'Copiado','Blocked':'Bloqueado',
'Export answers (CSV)':'Exportar respostas (CSV)','One row per answer, {0} logged. Paste into Sheets or Excel':'Uma linha por resposta, {0} registradas. Cole no Planilhas ou Excel',
'Import':'Importar','Paste scores copied with Export':'Cole os resultados copiados com Exportar','Paste':'Colar',
'Reset puzzle IQ':'Zerar QI dos desafios','Back to 100, keeps the full test history':'Volta a 100, mantém o histórico dos testes completos','Reset':'Zerar',
'Reset everything':'Zerar tudo','Puzzle IQ, test history, seen questions':'QI dos desafios, histórico de testes, perguntas vistas',
'Calibration':'Calibração','ICAR-anchored':'Ancorado no ICAR',
'Matrix +0.3, series 0, logic −0.4 SD, from ICAR sample data (N = 1,525, GPL-licensed psychTools). Verbal, rotation, memory and speed are not anchored.':'Matrizes +0,3, séries 0, lógica −0,4 DP, a partir de dados amostrais do ICAR (N = 1.525, psychTools sob GPL). Verbal, rotação, memória e velocidade não têm âncora. Os itens verbais em português são novos e não foram calibrados.',
'Estimates only. Not normed on a population sample and not a clinical assessment.':'Apenas estimativas. Sem normas de uma amostra populacional e sem valor de avaliação clínica.',
// sheets
'Import results':'Importar resultados','Paste the JSON copied with Export. Merge adds missing tests and answers and keeps the puzzle IQ that has more answers. Replace overwrites the scores on this device.':'Cole o JSON copiado com Exportar. Mesclar adiciona testes e respostas que faltam e mantém o QI dos desafios com mais respostas. Substituir sobrescreve os resultados deste aparelho.',
'Paste here':'Cole aqui','Merge with current':'Mesclar com o atual','Replace current':'Substituir o atual','Cancel':'Cancelar','That is not valid exported data.':'Esses não são dados exportados válidos.',
'Reset everything?':'Zerar tudo?','Reset puzzle IQ?':'Zerar o QI dos desafios?','This cannot be undone.':'Isso não pode ser desfeito.',
'Loading your scores…':'Carregando seus resultados…','Something broke':'Algo deu errado',
// sessions
'Next section':'Próxima seção','Items get harder as you go. If you are unsure, give your best answer.':'Os itens ficam mais difíceis ao longo do teste. Se tiver dúvida, dê sua melhor resposta.','Begin':'Começar',
'Quit':'Sair','Stop':'Parar','streak':'sequência','Faster than typical':'Mais rápido que o típico','Slower than typical':'Mais lento que o típico','Correct':'Correto','Time’s up':'Tempo esgotado','Incorrect':'Incorreto',
'Next puzzle':'Próximo desafio','Submit':'Enviar','Next':'Próxima',
'Repeat the digits in the same order.':'Repita os dígitos na mesma ordem.','Enter the digits in reverse order.':'Digite os dígitos na ordem inversa.',
'Enter the numbers from lowest to highest, then the letters in alphabetical order.':'Digite os números do menor para o maior e depois as letras em ordem alfabética.',
'Working memory · {0} items':'Memória de trabalho · {0} itens','Items appear one at a time, then you type your answer. Do not write them down.':'Os itens aparecem um de cada vez e depois você digita a resposta. Não anote.',
'Start':'Iniciar','Watch closely':'Observe com atenção','Delete':'Apagar','{0} · {1} seconds':'{0} · {1} segundos',
'Each symbol has a number. Tap the number that matches the symbol shown, as fast as you can without errors.':'Cada símbolo tem um número. Toque no número que corresponde ao símbolo mostrado, o mais rápido possível sem errar.',
'Two target symbols are shown on the left. Tap YES if either one appears in the row on the right, otherwise NO.':'Dois símbolos-alvo aparecem à esquerda. Toque em SIM se algum deles aparecer na fileira à direita; caso contrário, NÃO.',
'YES':'SIM','NO':'NÃO','No answers':'Sem respostas','Back':'Voltar','Full test · estimated IQ':'Teste completo · QI estimado','under 1':'menos de 1','over 99':'mais de 99',
'above about {0}% of people if norms held':'acima de cerca de {0}% das pessoas, se as normas valessem','Index scores':'Índices','Index':'Índice',
'Not a norm-referenced or clinical score. Matrix, series and logic difficulty is anchored to ICAR data (1,525 people, a self-selected online sample). Verbal, rotation, memory and speed are not anchored. The range includes extra uncertainty from calibration.':'Não é uma pontuação normatizada nem clínica. A dificuldade de matrizes, séries e lógica foi ancorada em dados do ICAR (1.525 pessoas, amostra on-line autosselecionada). Verbal, rotação, memória e velocidade não têm âncora. O intervalo inclui incerteza extra da calibração.',
'Copy summary':'Copiar resumo','See stats':'Ver estatísticas','Copy blocked':'Cópia bloqueada','Stop here?':'Parar por aqui?','Your puzzle IQ is saved after every answer.':'Seu QI dos desafios é salvo a cada resposta.',
'Keep going':'Continuar','Leave the full test?':'Sair do teste completo?','Your answers so far will be lost.':'Suas respostas até agora serão perdidas.','Leave':'Sair',
'IQ Lab full test: FSIQ {0} (95% range {1}-{2}), {3}. ':'IQ Lab teste completo: QI total {0} (intervalo de 95% {1}-{2}), {3}. ','Uncalibrated estimate.':'Estimativa não calibrada.',
// generated items
'Which number comes next?':'Qual número vem a seguir?','Matrix reasoning':'Raciocínio matricial','Which piece completes the pattern?':'Qual peça completa o padrão?','Mental rotation':'Rotação mental',
'Which option is the shape below, turned but not flipped?':'Qual opção é a forma abaixo, girada mas não espelhada?','Read the statements, then answer.':'Leia as afirmações e depois responda.',
'Cannot tell':'Não dá para saber','Which letter comes next?':'Qual letra vem a seguir?'
};
