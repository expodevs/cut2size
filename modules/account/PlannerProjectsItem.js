import React, {useState} from "react";
import WebpImage from "../parts/WebpImage";
import {UncontrolledTooltip} from "reactstrap";
import CustomerPlannerProjectItem from "./CustomerPlannerProjectItem";

const PlannerProjectsItem=({project,editProject,deleteProject, index})=>{
    const [show,setShow] = useState(false);

    return <div className={"order-item" + (index === 0 ? ' first' : '')} >

        <ul className="order-information no-pointer"
        >
            <li className="order-number"><span>#{project.project_id}</span></li>
            <li className="order-cabinet"><span>{project.cabinet_name}</span></li>
            <li className="order-name">{project.name}</li>
            <li className="order-date">{project.createdAt}</li>
            <li className="btn-block">
                    {deleteProject &&
                        <React.Fragment>
                            <button
                                id={'delete-project-' + project.project_id}
                                className="btn btn-danger btn-delete deleteCartOrder"
                                onClick={(e)=>deleteProject(e,project)}>
                                <WebpImage src={'/images/delete.svg'}/>
                            </button>
                            <UncontrolledTooltip placement="top" autohide={true} target={'delete-project-' + project.project_id}>Remove Project</UncontrolledTooltip>
                        </React.Fragment>
                    }
                    {editProject &&
                    <React.Fragment>
                        <button
                            id={'edit-product-' + project.project_id}
                            onClick={(e)=> editProject(e,project ) }
                            className="btn btn-outline-primary product-item-edit" >
                            <WebpImage src={'/images/edit.svg'}/>
                        </button>
                        <UncontrolledTooltip placement="top" autohide={true} target={'edit-product-' + project.project_id}>Edit Item</UncontrolledTooltip>
                    </React.Fragment>
                    }
                    <button
                        id={'view-hide-' + project.project_id}
                        className="btn btn-outline-primary"
                        onClick={e=>setShow(!show)}
                        data-toggle="collapse"
                        data-target={'#collapse'+project.project_id}
                        aria-expanded={show}
                        aria-controls={'#collapse'+project.project_id} >
                        {!show ? 'View' : 'Hide'}
                        <UncontrolledTooltip placement="top" autohide={true} target={'view-hide-' + project.project_id}>{!show ? 'View' : 'Hide'} Project Details</UncontrolledTooltip>
                    </button>
            </li>
        </ul>
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
export default PlannerProjectsItem;
