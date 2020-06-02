import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DataStorageService} from '../../services/data-storage.service';
import {Question} from '../../models/question.model';
import {QuestionService} from '../../services/question.service';
import {Poll} from '../../models/poll.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {ActivatedRoute} from '@angular/router';
import {PollService} from '../../services/poll.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  @Input() poll: Poll;

  questionsSubscription: Subscription;
  questions: Question[] = [];

  answersForm: FormGroup;
  isDirectView: boolean;

  isAuthenticated: boolean;

  constructor(
    private questionService: QuestionService,
    private pollService: PollService,
    private dataStorageService: DataStorageService,
    private cdr: ChangeDetectorRef,
    private toastr: NbToastrService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.isAuthenticated = !!this.userService.user.value;

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isDirectView = true;
        this.questionsSubscription = this.questionService.questionsChanged
          .subscribe((questions: Question[]) => {
            this.questions = questions;
            this.initForms();
          });
        this.poll = this.pollService.getPollsList().find(p => p.id === Number(id));
        if (this.poll) {
          this.dataStorageService.fetchQuestionsListFilteredByPoll(Number(id)).subscribe();
          this.questions = this.questionService.getQuestionsList();
          this.initForms();
        }
      } else {
        this.questionsSubscription = this.questionService.questionsChanged
          .subscribe((questions: Question[]) => {
            this.questions = questions;
            this.initForms();
          });
        this.questions = this.questionService.getQuestionsList();
        this.initForms();
      }
    });
  }

  ngOnDestroy(): void {
    this.questionsSubscription.unsubscribe();
  }

  initForms() {
    this.initAnswersForm();
  }

  initAnswersForm() {
    this.answersForm = new FormGroup({
      answers: new FormArray([])
    });
    this.questions.forEach(q => {
      this.answersArray.push(new FormControl('', q.required ? Validators.required : []));
    });
  }

  get answersArray() {
    return this.answersForm.get('answers') as FormArray;
  }

  submitPollAnswers() {
    console.log('answersFOrm', this.answersForm.value);
    const requestBody = {
      poll: this.poll.id,
      answers: []
    };

    this.answersArray.value.forEach((value, index) => {
      console.log('value', value);
      requestBody.answers.push({
        answer: value,
        question: this.questions[index].id,
      });
    });

    this.dataStorageService.submitPoll(requestBody).subscribe(success => {
      this.dataStorageService.fetchPollsList(null).subscribe();
      // this.pollSubmit.emit(true);
      this.toastr.show(
        null,
        'Successfully submitted poll answers',
        { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
    }, error => {
      console.log(error);
    });
  }
}
