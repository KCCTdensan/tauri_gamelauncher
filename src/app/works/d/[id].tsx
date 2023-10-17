'use client'

import React, { Component, ReactNode } from 'react';
import { withRouter, NextRouter } from 'next/router';

interface PostProps {
  router: NextRouter;
}

interface PostState {
  id: string | null;
}

class Post extends Component<PostProps, PostState> {
  constructor(props: PostProps) {
    super(props);
    this.state = {
      id: null,
    };
  }

  componentDidMount() {
    const { router } = this.props;
    const { id } = router.query;
    if (typeof id === 'string') {
      this.setState({ id });
    }
  }

  render(): React.ReactNode {
    const { id } = this.state;

    return <p>Post: {id}</p>;
  }
}

export default withRouter(Post);
