#include <UTFT.h>
#include <Keypad.h>
// #include <SoftwareSerial.h>


//SoftwareSerial xbee(0, 1);


const int ROW_NUM = 3; //four rows
const int COLUMN_NUM = 3; //four columns

char tableau[4] = {'\0', '\0', '\0', '\0'};

char keys[ROW_NUM][COLUMN_NUM] = {
{'c','D','V'},
{'A','B','C'},
{'+','-','M'},
};

String trame; // La trame à envoyer

byte pin_rows[ROW_NUM] = {3, 4, 6}; //connect to the row pinouts of the keypad
byte pin_column[COLUMN_NUM] = {2, 5, 7}; //connect to the column pinouts of the keypad
Keypad keypad = Keypad( makeKeymap(keys), pin_rows, pin_column, ROW_NUM, COLUMN_NUM );


// Declare which fonts we will be using
extern uint8_t SmallFont[];
extern uint8_t BigFont[];

UTFT myGLCD(QD220A, A2, A1, A5, A4, A3);

// Setup //////////////////////////////////////////////////////////////////////
void setup() {
  
  keypad.setDebounceTime(10);
  keypad.setHoldTime(100);
  
  // Setup the LCD
  myGLCD.InitLCD();
  myGLCD.clrScr();

  myGLCD.setFont(BigFont);
  myGLCD.setBrightness(16);
  
  Serial.begin(9600);
  //pinMode(0, INPUT);
  //pinMode(1, OUTPUT);
}

//////////////////////////////////////////////////////////////////////////////
void loop() {
  if (Serial.available())
  {
    char recu = Serial.read();
    myGLCD.print(recu, CENTER, 45);
  }
  
  char key= keypad.getKey();
  
  if(key) // On appuie sur une touche du clavier matriciel
  {
    Serial.print(key);  // Afficher le carctere saisie sur l'afficheur LCD
  }

 // myGLCD.print("Question :", CENTER, 0);

  //delay(200);

  if (key)
  {
    gestionSaisie(key);
    String msg;
    msg = "     " + trame + "   ";
    myGLCD.print(msg.c_str(), LEFT, 30);
  }

  for (int i = 0; i < sizeof(tableau); i++) {
    if (tableau[i] == '\0') 
    {
      tableau[i] = key;
      break;
    }
  }

  if (key == 'V') // Touche de validation
  { 
    String msg = trame; // Copier la trame actuelle pour l'envoyer
    trame = ""; // Réinitialiser la trame
    String dataToSend = "$0206" + msg + "!";
    Serial.println(dataToSend);
    //xbee.println(dataToSend);
  }
  
  //String phrase = trame;
  //Serial.println(phrase);
 
// créer un tableau de 4 index (vide), a chaque fois clique touche ajoute touche cliquer dans tableau, validé envoie la trame (format et vide le tableau
  
}


/////////////////////////////////////////////////////////////
void gestionSaisie(char key)
{
     if (key == 'c' ) //Correction = 1, efface dernière charactère
    {
      trame.remove(trame.length() - 1);
      return;
    }
  
    if ( trame.indexOf(key) == -1 ) //Empêche le doublon
    {
      trame = trame + key;
      return;
    }
}

/////////////////////////////////////////////////////////////
//void Changequestion (char key)
//{
//  if (key == '+' ) //Correction = 1, efface dernière charactère
//    {
//      myGLCD.clrScr();      
//    }
//}
