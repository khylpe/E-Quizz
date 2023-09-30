#include <UTFT.h>



// Declare which fonts we will be using
extern uint8_t SmallFont[];
extern uint8_t BigFont[];

//char server[] = "10.69.88.25:8100

//UTFT myGLCD(Model,SDA,SCL,CS,RST,RS)
// QD220A <=> ILI9225
// Taille de l'écran : 220x176
UTFT myGLCD(QD220A, A2, A1, A5, A4, A3);

// Setup
void setup() {
  // Setup the LCD
  myGLCD.InitLCD();
  myGLCD.clrScr();
  
}

/*
 * Loop s'occupe de dessiner un cercle qui change de couleur de façon aléatoire
 * toutes les demi-secondes
 */
void loop() {
  randomSeed(100);

  // Ecriture Titre
  myGLCD.setFont(BigFont);
  myGLCD.setBackColor(VGA_WHITE);
  myGLCD.setColor(VGA_BLACK);
  myGLCD.setBrightness(16);
  myGLCD.print("Reponse :", CENTER, 1);

  delay(200);
}

// Déssin de cercles de couleur aléatoires
  //while (1)
  //{
  //  myGLCD.setColor(random(125,255), random(125,255), random(125,255));
  //  myGLCD.fillCircle(110, 88, 50);
  //  delay(200);
