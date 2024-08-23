import React, {useEffect, useState} from "react";
import {store} from "../../../../store";
import {deleteItem, getInfo, sendPost} from "../../../../actions/admin";
import {withRouter} from "react-router-dom";
import PlannerProjectsItem from "./PlannerProjectsItem";
import {confirmAlert} from "react-confirm-alert";
import EmptyOrders from "./EmptyOrders";
import {userDevice} from "../../../../functions/frontend";
import PlannerProjectsItemMobile from "./PlannerProjectsItemMobile";

const PlannerProjects=({history})=>{

    const [projects,setProjects] = useState([]);
    const [loadingProjects,setLoadingProjects] = useState(false);

    useEffect(()=>{
        getProjects();
    },[])

    const getProjects=async ()=>{
        const ApiUrl = process.env.REACT_APP_API_SERVER_URL;
        setLoadingProjects(true);
        store.dispatch(
            getInfo(ApiUrl+'/customer-planner-projects/customer'))
            .then(res=>{
                setProjects(res)
                setLoadingProjects(false);

            })
            .catch(error=>{
                console.log('error',error);
                setProjects(error)

                setLoadingProjects(false);
            });
    };

    const editProject=(e,project)=>{

        let projectLink = project.project_link.indexOf('#')!==-1 ? '/planner#'+project.project_link.split('#')[1] :project.project_link;

        const url = `${projectLink}&cabinet=${project.cabinet_name}&link=${project.cabinet_link}`;
        console.log(projectLink,url,project);
        // history.push(url);
        window.open(url,'_blank')
    };
    const deleteProject=(e,project)=>{

        confirmAlert({
            title: 'Confirm delete',
            message: 'Are you sure you want to delete the project?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        store.dispatch(deleteItem(process.env.REACT_APP_API_SERVER_URL+'/customer-planner-projects/customer/'+project.id,)).then(res=>{
                            window.location.reload()

                        }).catch(err=>{console.log(err)})
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    console.log('projects',projects)
    return (
        <React.Fragment>
            <h1 className="account-title">3D Planner Projects</h1>
            <div className="orders-history">
                <div className="orders-list">
                    {loadingProjects && <span>Loading...</span>}
                    {(projects && projects.length>0) ?
                        <React.Fragment>
                            <div className={'orders-list-header'}>
                                <div className={'header-order-number'}>Project ID</div>
                                <div className={'header-order-cabinet'}>Cabinet</div>
                                <div className={'header-order-name'}>Project Name</div>
                                <div className={'header-order-date'}>Date</div>
                                {/*<div className={'header-order-add-to-cart'}>&ensp;</div>*/}
                                <div className={'header-btn-block'}>&ensp;</div>
                            </div>
                            {projects.map((project, index) => {
                                        if (userDevice() === 'desktop')
                                            return <PlannerProjectsItem
                                                index={index}
                                                editProject={editProject}
                                                deleteProject={deleteProject}
                                                project={project}
                                            />
                                        else
                                            return <PlannerProjectsItemMobile
                                                index={index}
                                                editProject={editProject}
                                                deleteProject={deleteProject}
                                                project={project}
                                            />;
                                }
                            )}
                        </React.Fragment>
                        :
                        <EmptyOrders
                            title={'No Saved Planner Projects'}
                            text={'You don’t have any saved projects yet.'}
                            history={history}
                        />
                    }
                </div>
            </div>
        </React.Fragment>
    )
};
export default withRouter(PlannerProjects);
