import { Formik, Form } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Segment, Header, Comment, Button } from 'semantic-ui-react'
import MyTextArea from '../../../app/common/form/MyTextArea'
import { useStore } from '../../../app/stores/store'
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns'

export default observer(function ActivityDetailedChat() {
    const { activityStore } = useStore();
    const { createHubConnection, stopHubConnection, 
            selectedActivity: activity, addComment } = activityStore;

    useEffect(() => {
        if (activity) createHubConnection(activity.id);
        return () => {
            if (activity) stopHubConnection(activity.id)
        }
    }, [activity, createHubConnection, stopHubConnection])

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached>
                <Comment.Group>
                    {activity?.comments?.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                                    {comment.displayName}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                    <Formik
                        onSubmit={(values, {resetForm}) => addComment(values).then(() => resetForm())}
                        initialValues={{body: ''}}
                        validationSchema={Yup.object({
                            body: Yup.string().required()
                        })}
                    >
                        {({isSubmitting, isValid, dirty}) => (
                            <Form className='ui form'>
                                <MyTextArea 
                                    placeholder='Add Comment'
                                    name='body'
                                    rows={2}
                                />
                                <Button 
                                    loading={isSubmitting}
                                    disabled={isSubmitting || !isValid || !dirty}
                                    content='Add comment'
                                    labelPosition='left'
                                    icon='edit'
                                    primary
                                    type='submit'
                                />
                            </Form>
                        )}
                    </Formik>
                </Comment.Group>
            </Segment>
        </>

    )
})