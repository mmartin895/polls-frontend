import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {QuestionTypeEnum, questionTypes} from '../../models/question.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataStorageService} from '../../services/data-storage.service';
import {PollService} from '../../services/poll.service';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {Poll} from '../../models/poll.model';
import {UserService} from '../../services/user.service';
import {Subscription} from 'rxjs';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-poll-edit',
  templateUrl: './poll-edit.component.html',
  styleUrls: ['./poll-edit.component.scss']
})
export class PollEditComponent implements OnInit, OnDestroy {
  @Output() pollSubmit: EventEmitter<boolean> = new EventEmitter();
  @Input() poll: Poll;
  @Input() editMode: boolean;

  questionTypes: QuestionTypeEnum[];
  questionTypesMapped: Map<QuestionTypeEnum, string>;
  pollInfoForm: FormGroup;
  pollQuestionsForm: FormGroup;

  private userSub: Subscription;
  private user: User;

  constructor(
    private dataStorageService: DataStorageService,
    private pollService: PollService,
    private toastr: NbToastrService,
    private userService: UserService
  ) {
    this.questionTypes = questionTypes;
    this.questionTypesMapped = new Map<QuestionTypeEnum, string>();
    this.questionTypesMapped.set(QuestionTypeEnum.TI, 'Text input');
    this.questionTypesMapped.set(QuestionTypeEnum.NI, 'Numeric input');
    this.questionTypesMapped.set(QuestionTypeEnum.SC, 'Single choice');
    // this.questionTypesMapped.set(QuestionTypeEnum.MC, 'Multiple choices');
    this.questionTypesMapped.set(QuestionTypeEnum.DC, 'Dropdown choice');
  }

  ngOnInit(): void {
    this.userSub = this.userService.user.subscribe(user => {
      this.user = user;
    });

    this.initForms();
  }

  initForms() {
    this.initPollInfoForm();
    this.initPollQuestionsForm();
  }

  initPollInfoForm() {
    if (this.poll) {
      this.pollInfoForm = new FormGroup({
        title: new FormControl(this.poll.title, Validators.required),
        description: new FormControl(this.poll.description, Validators.required),
        premium: new FormControl(this.poll.premium),
      });
    } else {
      this.pollInfoForm = new FormGroup({
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        premium: new FormControl(false)
      });
    }
  }

  initPollQuestionsForm() {
    if (this.poll) {
      this.pollQuestionsForm = new FormGroup({
        questions: new FormArray([])
      });

      this.poll.questions.forEach(q => {
        this.questionsArray.push(new FormGroup({
          content: new FormControl(q.content, Validators.required),
          type: new FormControl(q.type, Validators.required),
          choices: new FormControl(q.choices.split(';')),
          required: new FormControl(q.required)
        }));
      });
    } else {
      this.pollQuestionsForm = new FormGroup({
        questions: new FormArray([
          new FormGroup({
            content: new FormControl('', Validators.required),
            type: new FormControl(QuestionTypeEnum.TI, Validators.required),
            choices: new FormControl(),
            required: new FormControl(false)
          })
        ])
      });
    }
  }

  get questionsArray() {
    if (this.pollQuestionsForm) {
      return this.pollQuestionsForm.get('questions') as FormArray;
    }
  }

  addEmptyQuestion() {
    this.questionsArray.push(
      new FormGroup({
        content: new FormControl('', Validators.required),
        type: new FormControl(QuestionTypeEnum.TI, Validators.required),
        choices: new FormControl(),
        required: new FormControl(false)
      })
    );
  }

  closePollForm() {
    this.pollSubmit.emit(true);
  }

  removeQuestion(index: number) {
    this.questionsArray.removeAt(index);
  }

  createPoll() {
    console.log('pollInfoForm', this.pollInfoForm.value);
    console.log('pollQuestionsForm', this.pollQuestionsForm.value);
    const pollInfo = this.pollInfoForm.value;
    const pollQuestions = this.pollQuestionsForm.value.questions;
    const requestBody = {
      title: pollInfo.title,
      description: pollInfo.description,
      premium: pollInfo.premium,
      questions: [],
    };
    pollQuestions.forEach((q) => {
      requestBody.questions.push({
        content: q.content,
        type: q.type,
        choices: q.choices ? q.choices.map(item => item.value).join(';') : '',
        required: q.required
      });
    });
    console.log('requestBody', requestBody);

    if (this.editMode) {
      this.dataStorageService.updatePoll(requestBody, String(this.poll.id)).subscribe(success => {
        console.log('user poll edit', this.user);
        this.dataStorageService.fetchPollsList(this.user.id).subscribe();
        this.pollSubmit.emit(true);
        this.toastr.show(
          null,
          'Successfully updated poll',
          { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
      }, error => {
        console.log(error);
      });
    } else {
      this.dataStorageService.createPoll(requestBody).subscribe(success => {
        console.log('user poll edit', this.user);
        this.dataStorageService.fetchPollsList(this.user.id).subscribe();
        this.pollSubmit.emit(true);
        this.toastr.show(
          null,
          'Successfully created poll',
          { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
      }, error => {
        console.log(error);
      });
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
