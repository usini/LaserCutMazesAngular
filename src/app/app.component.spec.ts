/* tslint:disable:no-unused-variable */

import { async, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";
import { HelpModalComponent } from "./help-modal/help-modal.component";
import { MazeBuilderComponent } from "./maze-builder/maze-builder.component";

describe("AppComponent", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                RouterTestingModule
            ],
            declarations: [
                AppComponent,
                HelpModalComponent,
                MazeBuilderComponent
            ],
        });
        void TestBed.compileComponents();
    });

    it("should create the app", async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        void expect(app).toBeTruthy();
    }));
});
