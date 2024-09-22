export const getRandomFirstName = (): string => {
  const firstNames: string[] = [
    'Aaliyah',
    'Hiroshi',
    'Zara',
    'Mateo',
    'Fatima',
    'Luca',
    'Priya',
    'Ahmed',
    'Yara',
    'Dante',
    'Santiago',
    'Amara',
    'Kofi',
    'Mei',
    'Hassan',
    'Leila',
    'Akira',
    'Zainab',
    'Elio',
    'Tariq',
    'Indira',
    'Omar',
    'Sofia',
    'Anaya',
    'Nina',
    'Wei',
    'Juan',
    'Aria',
    'Mohammed',
    'Suki',
    'Aliyah',
    'Ibrahim',
    'Aminata',
    'Ezra',
    'Keiko',
    'Selim',
    'Mina',
    'Ayesha',
    'Zuri',
    'Ravi',
  ]

  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)]

  return randomFirstName
}
