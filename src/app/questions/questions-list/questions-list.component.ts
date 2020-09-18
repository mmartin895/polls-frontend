import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {DataStorageService} from '../../services/data-storage.service';
import {Question, QuestionTypeEnum} from '../../models/question.model';
import {QuestionService} from '../../services/question.service';
import {Poll, SubmittedPoll} from '../../models/poll.model';
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
  @Output() answersSubmitted = new EventEmitter();

  questionsSubscription: Subscription;
  questions: Question[] = [];

  answersForm: FormGroup;
  isDirectView: boolean;

  isAuthenticated: boolean;
  isAlreadySubmittedByUser: boolean;

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

  checkIfPollAlreadySubmittedByUser() {
    if (this.isAuthenticated) {
      const userEmail = this.userService.user.value.email;
      this.dataStorageService.fetchSubmittedPollForUser(this.poll.id).subscribe((success: SubmittedPoll[]) => {
        if (success && success.length > 0) {
          if (success.findIndex(submittedPoll => submittedPoll.user ? submittedPoll.user === userEmail : false) !== -1) {
            this.isAlreadySubmittedByUser = true;
          } else {
            this.isAlreadySubmittedByUser = false;
          }
        }
      }, error => {
        console.log('fetchSubmittedPollForUser error', error);
      });
    } else {
      this.isAlreadySubmittedByUser = false;
    }
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
          this.checkIfPollAlreadySubmittedByUser();
          this.dataStorageService.fetchQuestionsListFilteredByPoll(Number(id)).subscribe();
          this.questions = this.questionService.getQuestionsList();
          this.initForms();
        }
      } else {
        this.checkIfPollAlreadySubmittedByUser();
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
    this.questions.forEach((q, index) => {
      if (q.type !== QuestionTypeEnum.MC) {
        // this.answersArray.push(new FormControl('', q.required ? Validators.required : []));
        this.answersArray.push(new FormGroup({
          answer: new FormControl('', q.required ? Validators.required: [])
        }));
      } else {
        this.answersArray.push(new FormGroup({
          mcAnswers: new FormArray([])
        }));
        q.choices.split(';').forEach(choice => {
          (this.answersArray.controls[index].get('mcAnswers') as FormArray).push(new FormControl());
        });
      }
    });
  }

  get answersArray() {
    return this.answersForm.get('answers') as FormArray;
  }

  submitPollAnswers() {
    const requestBody = {
      poll: this.poll.id,
      answers: []
    };

    this.answersArray.value.forEach((value, index) => {
      if (value.mcAnswers && value.mcAnswers instanceof Array) {
        const mcAnswersArray = [];
        value.mcAnswers.forEach((mca, index2) => {
          if (mca === true) {
            mcAnswersArray.push(this.questions[index].choices.split(';')[index2]);
          }
        });
        if (mcAnswersArray.length > 0){
          requestBody.answers.push({
            answer: mcAnswersArray.join(';'),
            question: this.questions[index].id,
          });
        }
      } else {
        if (value.answer !== '') {
          requestBody.answers.push({
            answer: value.answer,
            question: this.questions[index].id,
          });
        }
      }
    });

    this.dataStorageService.submitPoll(requestBody).subscribe(success => {
      this.dataStorageService.fetchPollsList(null).subscribe();
      this.answersSubmitted.emit();
      this.toastr.show(
        null,
        'Successfully submitted poll answers',
        { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
    }, error => {
      console.log(error);
    });
  }

  onCheckChange(event, index: number) {
    const formArray: FormArray = this.answersArray.controls[index].get('mcAnswers') as FormArray;
    /* Selected */
    if (event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value === event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
}
