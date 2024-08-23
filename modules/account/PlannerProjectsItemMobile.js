import React, {useState} from "react";
import WebpImage from "../parts/WebpImage";
import {UncontrolledTooltip} from "reactstrap";
import OrdersBtnBlock from "../OrdersBtnBlock";
import {formatName, formatPrice} from "../../../../functions/frontend";
import CustomerPlannerProjectItem from "./CustomerPlannerProjectItem";

const PlannerProjectsItemMobile=({project,editProject,deleteProject, index})=>{
    const [show,setShow] = useState(false);
console.log('project.customer_planner_projects_items', project.customer_planner_projects_items)
    return <div className={'order-item' + (index === 0 ? ' first' : '')}>
        <div className={'order-information-mobile'}>
            <div className={'top'}>
                <div className={'info'}>
                    <div className={'order-number'}>Project #{project.project_id}</div>
                    <div className={'order-name'}>{project.name}</div>
                    <div className={'order-cabinet'}>{project.cabinet_name}</div>
                </div>
                <div className={'btn-block'}>
                    <OrdersBtnBlock
                        project={project}
                        deleteProject={deleteProject}
                        editProject={editProject}
                        setShow={setShow}
                        show={show}
                    />
                </div>
            </div>
        </div>
        {show &&
        <div className={'order-products project-items'} id={'collapse' + project.project_id}>
            {project.customer_planner_projects_items.length > 0 ?
                project.customer_planner_projects_items.map((project_item, index) => {
                        return (
                            <CustomerPlannerProjectItem
                                key={index}
                                project_item={project_item}
                            />
                        );
                    }
                ) : <div className={'empty'}>No Saved Items in Project</div>}
        </div>
        }
    </div>
};
export default PlannerProjectsItemMobile;
