export enum QuestionTypeEnum {
  TI = 'TI',
  NI = 'NI',
  SC = 'SC',
  MC = 'MC',
  DC = 'DC',
}

export interface Question {
  id: number;
  content: string;
  choices: string;
  type: QuestionTypeEnum;
  required: boolean;
  poll: string;
  answers: number[];
}

export const questionTypes: QuestionTypeEnum[] = [
  QuestionTypeEnum.TI,
  QuestionTypeEnum.NI,
  QuestionTypeEnum.SC,
  QuestionTypeEnum.MC,
  QuestionTypeEnum.DC,
];
