'use client';
import { Component } from 'react';
import Typed from 'typed.js';

interface TypedTextProps {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  loop?: boolean;
}

class TypedText extends Component<TypedTextProps> {
  private typed?: Typed;

  componentDidMount() {
    const { strings, typeSpeed = 50, backSpeed = 50, loop = true } = this.props;

    this.typed = new Typed('#typed-output', {
      strings,
      typeSpeed,
      backSpeed,
      loop,
    });
  }

  componentWillUnmount() {
    if (this.typed) {
      this.typed.destroy();
    }
  }

  render() {
    return <span id="typed-output" />;
  }
}

export default TypedText;
