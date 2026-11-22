// Verbal bank, compact format: type|question|correct|wrong|wrong|wrong|level (correct option is always first; options are shuffled at runtime)
// V=Vocabulary S=Similarities K=Knowledge A=Analogy
const RAW=[];
RAW.push(...`V|Closest in meaning to “begin”.|start|finish|hide|repeat|1
V|Closest in meaning to “big”.|large|tiny|slow|dark|1
V|Opposite of “hot”.|cold|warm|wet|loud|1
V|Opposite of “ancient”.|modern|old|tall|quiet|1
V|Closest in meaning to “glad”.|happy|angry|tired|lost|1
V|Closest in meaning to “tiny”.|small|huge|heavy|loud|1
S|How are an apple and a banana alike?|Both are fruit|Both are yellow|Both grow underground|Both are vegetables|1
S|How are a dog and a cat alike?|Both are animals|Both bark|Both are wild|Both lay eggs|1
S|How are a car and a bicycle alike?|Both are vehicles|Both have engines|Both have four wheels|Both fly|1
S|How are a chair and a table alike?|Both are furniture|Both are made of glass|Both are for eating|Both are electric|1
S|How are a rose and a tulip alike?|Both are flowers|Both are trees|Both are red|Both are insects|1
K|How many days are in a leap year?|366|365|364|367|1
K|At what temperature does water freeze, in °C?|0°|32°|100°|−10°|1
K|How many days are in a week?|7|5|6|8|1
K|What do bees make?|Honey|Milk|Silk|Butter|1
K|How many minutes are in an hour?|60|30|100|45|1
K|Which animal is a mammal?|Whale|Shark|Trout|Octopus|1
K|What colour do you get by mixing blue and yellow?|Green|Purple|Orange|Brown|1
K|How many sides does a triangle have?|3|4|5|6|1
K|Which of these is a vegetable?|Carrot|Apple|Cherry|Plum|1
A|Bird is to nest as bee is to …|hive|honey|flower|wing|1
A|Cold is to ice as hot is to …|fire|snow|water|wind|1
A|Day is to night as up is to …|down|over|high|top|1
A|Eye is to see as ear is to …|hear|smell|taste|touch|1
V|Closest in meaning to “rapid”.|swift|gentle|rough|narrow|2
V|Closest in meaning to “brave”.|courageous|nervous|clever|polite|2
V|Opposite of “scarce”.|plentiful|rare|costly|ancient|2
V|Closest in meaning to “fragile”.|easily broken|very heavy|brightly coloured|well hidden|2
V|Closest in meaning to “reluctant”.|unwilling|eager|careless|famous|2
V|Opposite of “expand”.|shrink|grow|travel|spread|2
S|How are a violin and a drum alike?|Both are musical instruments|Both have strings|Both are made of wood|Both use a bow|2
S|How are a river and a road alike?|Both are ways to travel from place to place|Both contain water|Both are paved|Both flow downhill|2
S|How are a doctor and a teacher alike?|Both are professions that help people|Both work in hospitals|Both wear uniforms|Both write books|2
S|How are a mountain and a hill alike?|Both are raised areas of land|Both are covered in snow|Both are made of ice|Both are found in deserts|2
K|What is the capital of Canada?|Ottawa|Toronto|Vancouver|Montreal|2
K|Which gas do plants absorb for photosynthesis?|Carbon dioxide|Oxygen|Nitrogen|Helium|2
K|Which is the largest planet in our solar system?|Jupiter|Earth|Mars|Venus|2
K|What is the chemical formula of water?|H2O|CO2|O2|NaCl|2
K|How many continents are there?|7|5|6|8|2
K|Which metal is liquid at room temperature?|Mercury|Iron|Copper|Silver|2
K|What is the capital of France?|Paris|Lyon|Marseille|Nice|2
K|Which organ pumps blood around the body?|Heart|Lungs|Liver|Stomach|2
K|Which is the largest ocean?|Pacific|Atlantic|Indian|Arctic|2
K|Who painted the Mona Lisa?|Leonardo da Vinci|Michelangelo|Raphael|Botticelli|2
A|Hand is to glove as head is to …|hat|hair|neck|nose|2
A|Pilot is to airplane as captain is to …|ship|port|map|sea|2
A|Pen is to write as knife is to …|cut|sharp|kitchen|metal|2
A|Fish is to water as bird is to …|air|tree|egg|feather|2
V|Closest in meaning to “meticulous”.|careful|careless|quick|famous|3
V|Closest in meaning to “candid”.|frank|secretive|polite|shy|3
V|Closest in meaning to “scrutinize”.|examine closely|ignore|praise|hurry|3
V|Opposite of “benevolent”.|malicious|generous|ancient|honest|3
V|Closest in meaning to “ambiguous”.|open to more than one meaning|completely false|very loud|well known|3
V|Closest in meaning to “frugal”.|thrifty|generous|lazy|cheerful|3
V|Closest in meaning to “reticent”.|reserved|talkative|angry|confused|3
S|How are a poem and a statue alike?|Both are works of art|Both are written|Both are made of stone|Both rhyme|3
S|How are a seed and an egg alike?|Both can develop into a new living thing|Both are edible|Both are round|Both have shells|3
S|How are a clock and a calendar alike?|Both measure time|Both show the weather|Both are digital|Both need batteries|3
S|How are a fable and a parable alike?|Both are short stories that teach a lesson|Both are true histories|Both are poems|Both are plays|3
S|How are a bridge and a tunnel alike?|Both let travellers pass an obstacle|Both go underground|Both are made of steel|Both span water|3
K|Which organ produces insulin?|Pancreas|Liver|Kidney|Spleen|3
K|In which ocean are the Maldives?|Indian|Atlantic|Pacific|Arctic|3
K|What is the largest organ of the human body?|Skin|Liver|Brain|Heart|3
K|Which gas makes up most of Earth’s atmosphere?|Nitrogen|Oxygen|Carbon dioxide|Argon|3
K|Who developed the theory of general relativity?|Albert Einstein|Isaac Newton|Niels Bohr|Galileo Galilei|3
K|What is the capital of Australia?|Canberra|Sydney|Melbourne|Perth|3
K|Which part of the cell produces most of its energy?|Mitochondrion|Nucleus|Ribosome|Membrane|3
A|Thermometer is to temperature as barometer is to …|pressure|wind|rainfall|humidity|3
A|Author is to novel as composer is to …|symphony|orchestra|piano|concert|3
A|Seed is to tree as egg is to …|bird|nest|feather|shell|3
A|Ruler is to length as scale is to …|weight|height|balance|metal|3
A|Library is to books as museum is to …|artefacts|tickets|guards|paintings only|3`.split('\n'));
// Static logic items: question|correct|wrong|wrong|wrong|level
const LRAW=`Tom is taller than Sam. Sam is taller than Lee. Who is the shortest?|Lee|Tom|Sam|Cannot tell|1
All birds have feathers. A robin is a bird. Therefore a robin …|has feathers|lays no eggs|cannot fly|has fur|1
Which number does not belong: 9, 16, 25, 30?|30|9|16|25|2
If it rains, the street is wet. The street is wet. What follows?|It may or may not have rained|It rained|It did not rain|The street is dry|2
Ana is older than Bia. Caio is younger than Bia. Dan is older than Ana. Who is second oldest?|Ana|Bia|Caio|Dan|3
A bat and a ball cost 1.10 together. The bat costs 1.00 more than the ball. What does the ball cost?|0.05|0.10|0.15|0.01|3
5 machines make 5 widgets in 5 minutes. How long do 100 machines need to make 100 widgets?|5 minutes|100 minutes|20 minutes|1 minute|4
All Zorps are Blips. Some Blips are Grons. Which must be true?|Nothing definite links Zorps and Grons|Some Zorps are Grons|All Blips are Zorps|No Grons are Zorps|4
Lily pads double in area each day and cover the whole lake on day 48. On which day was half the lake covered?|47|24|46|40|5
A is true only if B is false. B is true only if C is true. C is false. What can be concluded?|B is false; A is undetermined|A is true and B is false|A is false and B is true|Nothing can be concluded about B|5`.split('\n');
