import * as bcrypt from 'bcrypt';

interface SeedUser {
  email: string;
  name: string;
  password: string;
  roles: string[];
  question: Question;
  answer: string;
}

enum Question{
  COMIDA = "comida",
  CANTANTE = "cantante",
  PAIS = "pais",
}

interface SeedCard {
  name: string;
  imageUrl: string;
}

type OfferCondition = 'Excelente' | 'Usado' | 'Nuevo';

interface SeedData {
  cards: SeedCard[];
  users: SeedUser[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'test1@google.com',
      name: 'Test One',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['user'],
      question: Question.PAIS,
      answer: bcrypt.hashSync('Argentina', 10),
    },
    {
      email: 'test2@google.com',
      name: 'Test Two',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['user', 'admin'],
      question: Question.PAIS,
      answer: bcrypt.hashSync('Argentina', 10),
    },
  ],
  cards: [
    {
      name: 'Carta 1',
      imageUrl: 'charizard.png',
    },
    {
      name: 'Carta 2',
      imageUrl: 'mago_oscuro.png',
    },
    {
      name: 'Carta 3',
      imageUrl: 'black_lotus.png',
    },
  ],
};
