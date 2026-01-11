"use client";
import { useState } from "react";
import ProgrammeData from "@/components/Programme/NewProgramme/ProgrammeData";
import SdgGroup from "@/components/Programme/NewProgramme/SdgGroup";
import IndicatorSelection from "@/components/Programme/NewProgramme/IndicatorSelection";
import useFilterForm from "@/utils/CustomHooks/useFilterForm";
import ProgrammeSucess from "@/components/Programme/NewProgramme/ProgrammeSucess";
import { CheckOutlined } from "@ant-design/icons";
import AddMilestone from "@/components/AllModals/AddMilestone";
import useModal from "@/utils/CustomHooks/useModal";
import AddEventModal from "@/components/AllModals/AddEventModal";

const NewProgrammeLogic = () => {
  const { filterText, filterInputChange } = useFilterForm();
  const [isModalVisible1, showModal1, handleCancel1] = useModal();
  const [isModalVisible2, showModal2, handleCancel2] = useModal();
  const [step, setStep] = useState(1);
  const [stepFinish, setStepFinish] = useState([
    {
      name: "step 1",
      finished: false,
    },
    {
      name: "step 2",
      finished: false,
    },
    {
      name: "step 3",
      finished: false,
    },
  ]);
  const nextStep = () => {
    const updatedSteps = [...stepFinish];
    updatedSteps[step - 1].finished = true; // Update the current step to finished
    setStepFinish(updatedSteps);
    setStep((prevStep) => prevStep + 1); // Move to the next step
  };
  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className="col-12">
      <div className="top-header">
        <h3 className="view-title">Create New Programme</h3>
        <div className="step__container d-flex">
          <div
            className={`step step1 ${step === 1 ? "active" : ""}`}
            onClick={() => setStep(1)}
          >
            {
              // step === 1 ?
              // <CheckCircleFilled className="step-icon" /> :
              <>
                <span
                  className={`step-icon ${
                    stepFinish[0].finished ? "finish" : ""
                  }`}
                >
                  {stepFinish[0].finished === true ? <CheckOutlined /> : 1}{" "}
                </span>
                <span className="step-margin">Step1</span>
                {/* <p>Fill in Programme Details</p> */}
              </>
            }
          </div>
          <div className={`indicator-line ${step === 1 ? "active" : ""}`}></div>
          <div
            className={`step step2 ${step === 2 ? "active" : ""}`}
            onClick={() => setStep(2)}
          >
            {
              // step === 2 ?
              // <CheckCircleFilled className="step-icon" /> :
              <>
                <span
                  className={`step-icon ${
                    stepFinish[1].finished ? "finish" : ""
                  }`}
                >
                  {stepFinish[1].finished ? <CheckOutlined /> : 2}
                </span>
                <span className="step-margin">Step2</span>
              </>
            }
          </div>
          <div className={`indicator-line ${step === 2 ? "active" : ""}`}></div>
          <div
            className={`step step3 ${step === 3 ? "active" : ""}`}
            onClick={() => setStep(3)}
          >
            {
              // step === 3 ?
              // <CheckCircleFilled className="step-icon" /> :
              <>
                <span
                  className={`step-icon ${
                    stepFinish[2].finished ? "finish" : ""
                  }`}
                >
                  {stepFinish[2].finished ? <CheckOutlined /> : 3}
                </span>
                <span className="step-margin">Step2</span>
              </>
            }
          </div>
        </div>
      </div>
      <div className="dashboard-card">
        {(() => {
          switch (step) {
            case 1:
              return (
                <ProgrammeData
                  nextStep={nextStep}
                  showModal1={showModal1}
                  showModal2={showModal2}
                />
              );
            case 2:
              return (
                <SdgGroup
                  filterText={filterText}
                  filterInputChange={filterInputChange}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              );
            case 3:
              return (
                <IndicatorSelection nextStep={nextStep} prevStep={prevStep} />
              );
            case 4:
              return <ProgrammeSucess />;
            default:
            // do nothing
          }
        })()}
      </div>
      <AddMilestone
        handleCancel={handleCancel1}
        isModalVisible={isModalVisible1}
      />
      <AddEventModal
        handleCancel={handleCancel2}
        isModalVisible={isModalVisible2}
      />
    </div>
  );
};

export default NewProgrammeLogic;
