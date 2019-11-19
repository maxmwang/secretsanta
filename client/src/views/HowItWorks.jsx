import React, { Component } from 'react';

class HowItWorks extends Component {
  render() {
    return (
      <div>
        <div className="text-left">
          <h3>How It Works</h3>

          <h5>Introduction</h5>
          <p>Secret Santa is a holiday tradition for large groups. Each member is assigned a Santa, whose identity is kept secret. The Santa must get a gift for their assignee.</p>
          <p>On Christmas day, everyone receives their gift, and the identity of their Santa is revealed.</p>

          <h5>Motivation</h5>
          <p>Assigning Santas is difficult, especially when the members of the group are physically separated. One option is to find a third-party to assign the Santas and inform each member of their assignee.</p>
          <p>Another problem is naively assigning Santas does not guarantee uniform probability. Usually, members put their names in a hat. Then, each member takes a turn picking a random name from the hat; if a member chooses their own name, they put it back and redraw. This redraw skews that even probability distribution, which in most cases is not a big deal. But, another problem is if the last member chooses their own name, then the entire process must restart, which can be annoying.</p>
          <p>Finally, there exists many secret Santa assignment services, so why another one? When I proposed the idea of secret Santa to my immediate family, I wanted to mix it up: instead of one Santa, everyone gets two. This meant more gifts! This app is an extension of the traditional secret Santa.</p>

          <h5>Solution</h5>
          <p>Secretsantaio addresses these pain points by acting as the third-party to assign Santas and implements an algorithm is avoid skewed probability. </p>

          <h5>Algorithm</h5>
          <p>A Secret Santa assignment can be represented as a graph, where each member is a node, and each “Santa assignment” is a directed edge. Given a set of nodes, the algorithm constructs a random graph such that each node has exactly one outgoing and one incoming edge. More generally, each node has an equal amount of outgoing and incoming edges (if you want to have several Santas). </p>
          <p>The algorithm starts by choosing a random node. From there, it creates an edge from that node to another random node. Then, it uses the new node to repeat the process. After each assignment, the assigned node is marked as visited, and cannot be assigned again. </p>
        </div>

        <button type="button" className="btn btn-light" onClick={this.props.goBack}>Back</button>
      </div>
    );
  }
}

export default HowItWorks;
