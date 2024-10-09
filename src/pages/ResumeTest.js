import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logIn } from '../redux/auth/operations';

export default function ResumeTest() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logIn({
            email: 'resume@test.ua',
            password: '12345678'
        }))
    }, [dispatch])

    return null;
}